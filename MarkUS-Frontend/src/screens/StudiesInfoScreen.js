import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { getAll, getDetail } from '../api/StudiesEndpoints'
import { create } from '../api/CourseEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { useIsFocused } from '@react-navigation/native'
import { FlatList } from 'react-native-gesture-handler'
import { ProgressCircle } from 'react-native-svg-charts'
import DropDownPicker from 'react-native-dropdown-picker'
import CreateModal from '../components/CreateModal'
import { Formik } from 'formik'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputItem from '../components/InputItem'
import * as yup from 'yup'
import AddButton from '../components/AddButton'
import TopSubjects from '../components/TopSubjects'

export default function StudiesInfoScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [open, setOpen] = useState(false)
  const [currentStudies, setCurrentStudies] = useState({})
  const [studiesNames, setStudiesNames] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendErrors, setBackendErrors] = useState()
  const [showModal, setShowModal] = useState(false)

  const initialValues = { credits: null, number: null }
  const validationSchema = yup.object().shape({
    number: yup
      .number()
      .positive('The course year must be positive')
      .integer('The course year must be integer')
      .required('The course year is required'),
    credits: yup
      .number()
      .positive('The number of credits must be positive')
      .integer('The number of credits must be integer')
      .required('The number of credits is required')
  })

  const isFocused = useIsFocused()

  const courseMapper = { 1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth', 6: 'Sixth', 7: 'Seventh' }

  const windowDimensions = Dimensions.get('window')
  const screenDimensions = Dimensions.get('screen')

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions
  })

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen })
      }
    )
    return () => subscription?.remove()
  })

  async function fetchOneStudies (id) {
    try {
      const fetchedStudies = await getDetail(id)
      setCurrentStudies(fetchedStudies)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving studies. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchOneStudies(route.params.id)
    setLoading(false)
  }, [route])

  useEffect(() => {
    async function fetchStudies () {
      if (!isFocused) {
        return
      }
      if (!loggedInUser) {
        setStudiesNames([])
        return
      }
      try {
        const fetchedStudies = await getAll()
        const fetchedStudiesReshaped = fetchedStudies.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setStudiesNames(fetchedStudiesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving studies. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    setLoading(true)
    fetchStudies()
    setLoading(false)
  }, [isFocused, loggedInUser])

  let stats = (Object.keys(currentStudies).length !== 0)
    ? {
        completion: (currentStudies.courses.filter((c) => c.status === 'taken').length) / currentStudies.years,
        subjects: currentStudies.courses.flatMap((c) => c.subjects),
        takenSubjects: currentStudies.courses.filter((c) => c.status === 'taken').flatMap((c) => c.subjects)
      }
    : {}

  stats = {
    ...stats,
    provisionalAvg: (stats.subjects?.reduce((acc, cv) => acc + cv.credits * cv.avgMark, 0)) / (stats.subjects?.reduce((acc, cv) => acc + cv.credits, 0)) || 0,
    officialAvg: (stats.subjects?.reduce((acc, cv) => acc + cv.credits * cv.officialMark, 0)) / (stats.subjects?.reduce((acc, cv) => acc + cv.credits, 0)) || 0,
    provisionalTakenAvg: (stats.takenSubjects?.reduce((acc, cv) => acc + cv.credits * cv.avgMark, 0)) / (stats.takenSubjects?.reduce((acc, cv) => acc + cv.credits, 0)) || 0,
    officialTakenAvg: (stats.takenSubjects?.reduce((acc, cv) => acc + cv.credits * cv.officialMark, 0)) / (stats.takenSubjects?.reduce((acc, cv) => acc + cv.credits, 0)) || 0,
    topSubjects: (stats.subjects?.length !== 0)
      ? stats.subjects?.sort(
        function (a, b) {
          return a.officialMark - b.officialMark
        }).slice(-5).map((s) => s.name + ': ' + (s.officialMark || 0) + ' (' + s.credits + ' credits)')
      : null
  }

  const renderCourse = ({ item }) => {
    return (
      <View style={styles.coursesCard}>
        <Pressable
        style={{ margin: 10 }}
        onPress={() => { navigation.navigate('Course info', { id: item.id, currentStudies: currentStudies.name }) }}>
          <Text>{courseMapper[item.number]} course</Text>
        </Pressable>
      </View>
    )
  }

  const renderEmptyCourses = () => {
    return (
      <>
      <View style={[styles.coursesCard, { alignItems: 'center' }]}>
        <View style={{ margin: 10 }}>
          <Text style={{ textAlign: 'center' }}>No courses found ({currentStudies.years} expected). Do you want to add a new course to {currentStudies.name}?</Text>
        </View>
      </View>
      <View style={{ marginTop: 10, alignSelf: 'center', alignItems: 'center' }}>
        <AddButton
        name='course'
        onCreate={() => setShowModal(true)}
        />
      </View>
      </>
    )
  }

  const renderStudiesSelector = () => {
    return (
      <>
        <DropDownPicker
          open={open}
          value={currentStudies.id}
          items={studiesNames}
          setOpen={setOpen}
          onSelectItem={ item => {
            fetchOneStudies(item.value)
          }}
          listMode={'SCROLLVIEW'}
          setItems={setStudiesNames}
          placeholder="Select studies"
          style={{ backgroundColor: GlobalStyles.brandBackground }}
          dropDownStyle={{ backgroundColor: '#fafafa' }}
        />
      </>
    )
  }

  const renderProgressCircle = () => {
    return (
      <View style={{ minHeight: 100, minWidth: 100, justifyContent: 'center', marginRight: 20 }}>
        <View style={{ position: 'absolute', alignSelf: 'center', height: 100, width: 80, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center' }}>{stats.completion * 100}% completed</Text>
        </View>
        <ProgressCircle style={{ minHeight: 100, minWidth: 100 }} progress={stats.completion || 0} progressColor={GlobalStyles.appPurple} strokeWidth={8}/>
      </View>
    )
  }

  const renderCoursesHeader = ({ item }) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text>See individual courses:</Text>
      </View>
    )
  }

  const renderCourses = () => {
    return (
      <>
        <FlatList
        data={currentStudies.courses}
        renderItem={renderCourse}
        style={{ flexGrow: 0, marginTop: 20 }}
        scrollEnabled={false}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyCourses}
        ListHeaderComponent={renderCoursesHeader}
        />
        {
          currentStudies && currentStudies.courses && currentStudies.courses.length !== 0
            ? <View style={{ marginTop: 10, alignSelf: 'center', alignItems: 'center' }}>
            <Text>{currentStudies.courses.length}/{currentStudies.years} courses added.</Text>
            {
              (currentStudies.courses.length !== currentStudies.years) &&
              <AddButton
              name='course'
              onCreate={() => setShowModal(true)}
              style={{ marginTop: 10 }}
              />
            }
          </View>
            : <></>
        }
      </>
    )
  }

  const createCourse = async (values) => {
    setBackendErrors([])
    try {
      values.studiesId = currentStudies.id
      const createdCourse = await create(values)
      showMessage({
        message: `Course ${createdCourse.name} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      setShowModal(false)
      await fetchOneStudies(route.params.id)
    } catch (error) {
      setBackendErrors(error.errors)
    }
  }

  return (
    loading
      ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <ActivityIndicator/>
    </View>
      : <ScrollView>
      <View style={{ padding: 20 }}>
        {
          renderStudiesSelector()
        }
        <View style={{ flexDirection: dimensions.window.width > 450 ? 'row' : 'column', marginTop: 20, alignItems: 'center' }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
              renderProgressCircle()
            }
            <View style={{ flex: 1 }}>
              <Text>
                STUDIES AVERAGE MARK (OVERALL): {stats.officialAvg}
              </Text>
              <Text>
                STUDIES AVERAGE MARK (TAKEN): {stats.officialTakenAvg}
              </Text>
              <Text>
              </Text>
            </View>
          </View>
          <TopSubjects
            width={dimensions.window.width}
            topSubjects={stats.topSubjects}
          />
        </View>
        {
          renderCourses()
        }
        <CreateModal
        isVisible={showModal}
        onCancel={() => {
          setShowModal(false)
          setBackendErrors()
        }}
        >

          <View style={{ maxHeight: dimensions.window.width < 450 ? 500 : 680, width: '90%' }}>
            <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 5 }}>Introduce new course details</Text>
            <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={createCourse}>
            {({ handleSubmit, setFieldValue, values }) => (
              <>
              <View style={{ marginVertical: 10 }}>
                <InputItem
                  name='number'
                  label='Course number (year):'
                />
                <InputItem
                  name='credits'
                  label='Number of credits:'
                />
              </View>

              {backendErrors &&
                backendErrors.map((error, index) => <Text key={index} style={{ color: 'red' }}>{error.param}: {error.msg}</Text>)
              }

              <Pressable
                onPress={() => {
                  setShowModal(false)
                  setBackendErrors()
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandPrimary
                      : GlobalStyles.brandPrimaryTap
                  },
                  styles.actionButton]}
              >
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='close' color={'white'} size={20}/>
                  <Text style={styles.text}>
                    Cancel
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.actionButton]}
                >
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name={'check'} color={'white'} size={20}/>
                  <Text style={styles.text}>
                    Create
                  </Text>
                </View>
              </Pressable>
              </>
            )}
            </Formik>
          </View>

        </CreateModal>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  coursesCard: { backgroundColor: 'white', marginVertical: 5, borderRadius: 15 },
  actionButton: {
    borderRadius: 8,
    height: 40,
    margin: 8,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  }
})

import React, { useEffect, useState, useContext } from 'react'
import { Text, StyleSheet, Dimensions, View, Pressable, Switch, ActivityIndicator } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import * as GlobalStyles from '../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../api/CourseEndpoints'
import CreateStudiesModal from '../components/CreateModal'
import { ErrorMessage, Formik } from 'formik'
import * as yup from 'yup'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputItem from '../components/InputItem'
import { create } from '../api/SubjectEndpoints'
import AddButton from '../components/AddButton'
import TopSubjects from '../components/TopSubjects'
import { AuthorizationContext } from '../context/AuthorizationContext'

export default function CourseInfoScreen ({ navigation, route }) {
  const [currentCourse, setCurrentCourse] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [backendErrors, setBackendErrors] = useState()
  const [loading, setLoading] = useState(true)
  const { loggedInUser } = useContext(AuthorizationContext)

  const initialValues = { name: null, shortName: null, isAnual: false, secondSemester: false, credits: null }
  const studiesName = route.params.currentStudies
  const topSubjects = currentCourse.subjects?.sort(
    function (a, b) {
      return a.officialMark - b.officialMark
    }).slice(-5).map((s) => {
    return ({
      label: s.shortName,
      value: s.officialMark || 0,
      credits: s.credits
    })
  })

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, 'Name too long')
      .required('Name is required'),
    shortName: yup
      .string()
      .max(10, 'Short name too long')
      .required('Short name is required'),
    credits: yup
      .number()
      .positive('The number of credits must be positive')
      .integer('The number of credits must be integer')
      .required('The number of credits is required'),
    secondSemester: yup
      .boolean(),
    isAnual: yup
      .boolean()
  })

  const courseMapper = { 1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth', 6: 'Sixth', 7: 'Seventh' }

  const windowDimensions = Dimensions.get('window')
  const screenDimensions = Dimensions.get('screen')

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions
  })

  useEffect(() => {
    if (!loggedInUser) {
      navigation.navigate('My studies')
    }
  }, [loggedInUser])

  async function fetchCourse (id) {
    try {
      const fetchedCourse = await getDetail(id)
      setCurrentCourse(fetchedCourse)
      setLoading(false)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving this course. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchCourse(route.params.id)
  }, [route])

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen })
      }
    )
    return () => subscription?.remove()
  })

  const renderSubject = ({ item }) => {
    return (
    <Pressable
      style={styles.box}
      onPress={() => { navigation.navigate('Subject info', { id: item.id, currentCourse }) }}
    >
      <Text style={{ textAlign: 'center', padding: 10 }}>
        {dimensions.window.width > 450 ? item.name : item.shortName}: {item.officialMark ? item.officialMark + ' (official)' : (item.avgMark ? item.avgMark : 'No mark yet') }
      </Text>
    </Pressable>
    )
  }

  const createSubject = async (values) => {
    setBackendErrors([])
    try {
      values.courseId = currentCourse.id
      const createdSubject = await create(values)
      showMessage({
        message: `Subject ${createdSubject.name} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      setShowModal(false)
      await fetchCourse(route.params.id)
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  const renderHeader = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.box, { fontWeight: '500' }]}>
        1st Semester ({currentCourse.credits / 2} credits)
        </Text>
        <Text style={[styles.box, { fontWeight: '500' }]}>
        2nd Semester ({currentCourse.credits / 2} credits)
        </Text>
      </View>
    )
  }

  const renderEmptySubjects = () => {
    return (
      <View style={[styles.coursesCard, { alignItems: 'center' }]}>
        <View style={{ margin: 10 }}>
          <Text style={{ textAlign: 'center' }}>No courses found. Do you want to add a new course to {studiesName}?</Text>
        </View>
      </View>
    )
  }

  return (
    loading
      ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <ActivityIndicator/>
    </View>
      : <View style={{ padding: 20 }}>
      <View style={{ marginVertical: 10 }}>
        <Text>{studiesName} - {courseMapper[currentCourse.number]} course</Text>
      </View>

      {
        (currentCourse.subjects && currentCourse.subjects.length !== 0)
          ? <>
        <FlatList
        data={currentCourse.subjects.filter((s) => s.isAnual)}
        renderItem={renderSubject}
        scrollEnabled={false}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        />
        <View style={{ flexDirection: 'row' }}>
          <FlatList
          style={{ flex: 1 }}
          data={currentCourse.subjects.filter((s) => !s.secondSemester && !s.isAnual)}
          renderItem={renderSubject}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          />
          <FlatList
          style={{ flex: 1 }}
          data={currentCourse.subjects.filter((s) => s.secondSemester && !s.isAnual)}
          renderItem={renderSubject}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          />
        </View>
        </>
          : <>
          {
            renderEmptySubjects()
          }
        </>
      }

      <View style={{ marginTop: 10, alignSelf: 'center', alignItems: 'center' }}>
        {
          <AddButton
          name='subject'
          onCreate={() => setShowModal(true)}
          />
        }
      </View>

      <TopSubjects
        width={dimensions.window.width}
        topSubjects={topSubjects}
        style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: 0 }}
      />

      <CreateStudiesModal
        isVisible={showModal}
        onCancel={() => setShowModal(false)}
      >
        {
          currentCourse.subjects?.map((s) => s.credits).reduce((accumulator, currentValue) => {
            return accumulator + currentValue
          }, 0) >= currentCourse.credits
            ? <View>
            <Text>You have already covered {currentCourse.credits} credits.</Text>
          </View>
            : <View style={{ maxHeight: dimensions.window.width < 450 ? 500 : 680, width: '90%' }}>
            <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 5 }}>Please add new subject info</Text>

            <Formik
              validationSchema={validationSchema}
              initialValues={initialValues}
              onSubmit={createSubject}>
              {({ handleSubmit, setFieldValue, values }) => (
                <>
                <InputItem
                  name='name'
                  label='Name:'
                />
                <InputItem
                  name='shortName'
                  label='Short name:'
                />
                <InputItem
                  name='credits'
                  label='Number of credits:'
                />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ marginVertical: 10, marginHorizontal: 5, marginLeft: 13 }}>Is anual:</Text>
                  <Switch
                    trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                    thumbColor={values.isAnual ? GlobalStyles.brandSecondary : '#f4f3f4'}
                    value={values.isAnual}
                    style={{ marginHorizontal: 5 }}
                    onValueChange={value =>
                      setFieldValue('isAnual', value)
                    }
                  />
                  <ErrorMessage name={'isAnual'} render={msg => <Text>{msg}</Text> }/>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', marginVertical: 5, marginHorizontal: 13, alignItems: 'center', alignSelf: dimensions.window.width < 450 ? 'center' : 'flex-start' }}>
                  <Text>1st Semester</Text>
                  <Switch
                    trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                    thumbColor={values.secondSemester ? GlobalStyles.brandSecondary : '#f4f3f4'}
                    value={values.secondSemester}
                    style={{ marginHorizontal: 5 }}
                    onValueChange={value =>
                      setFieldValue('secondSemester', value)
                    }
                  />
                  <ErrorMessage name={'secondSemester'} render={msg => <Text>{msg}</Text> }/>
                  <Text>2nd Semester</Text>
                </View>
                </View>

                {backendErrors &&
                  backendErrors.map((error, index) => <Text key={index} style={{ color: 'red' }}>{error.param}-{error.msg}</Text>)
                }

                <Pressable
                  onPress={() => setShowModal(false)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? GlobalStyles.appRedTap
                        : GlobalStyles.appRed
                    },
                    styles.actionButton]}
                >
                  <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                    <MaterialCommunityIcons name='close' color='white' size={20}/>
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
                        ? GlobalStyles.appGreenTap
                        : GlobalStyles.appGreen
                    },
                    styles.actionButton]}
                >
                  <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                    <MaterialCommunityIcons name='check' color='white' size={20}/>
                    <Text style={styles.text}>
                      Create
                    </Text>
                  </View>
                </Pressable>

                </>
              )}
            </Formik>
          </View>
       }
      </CreateStudiesModal>
    </View>
  )
}

const styles = StyleSheet.create({
  box: { textAlign: 'center', flex: 1, borderWidth: 1, padding: 5 },
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
  },
  coursesCard: { backgroundColor: 'white', marginVertical: 5, borderRadius: 15 }
})

import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet, Dimensions } from 'react-native'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { getAll, getDetail } from '../api/StudiesEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { useIsFocused } from '@react-navigation/native'
import { FlatList } from 'react-native-gesture-handler'
import { ProgressCircle } from 'react-native-svg-charts'
import DropDownPicker from 'react-native-dropdown-picker'
import CourseAdder from '../components/CourseAdder'

export default function StudiesInfoScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [open, setOpen] = useState(false)
  const [currentStudies, setCurrentStudies] = useState({})
  const [studies, setStudies] = useState([])
  const [stats, setStats] = useState([])

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
    fetchOneStudies(route.params.id)
  }, [route])

  useEffect(() => {
    async function fetchStudies () {
      if (!isFocused) {
        return
      }
      if (!loggedInUser) {
        setStudies([])
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
        setStudies(fetchedStudiesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving studies. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchStudies()
  }, [isFocused, loggedInUser])

  useEffect(() => {
    if (Object.keys(currentStudies).length === 0) return
    const stats = {}
    stats.completion = (currentStudies.courses.filter((c) => c.status === 'taken').length) / currentStudies.years
    const subjects = currentStudies.courses.flatMap((c) => c.subjects)
    const takenSubjects = currentStudies.courses.filter((c) => c.status === 'taken').flatMap((c) => c.subjects)
    stats.provisionalAvg = (subjects.reduce((acc, cv) => acc + cv.credits * cv.avgMark, 0)) / (subjects.reduce((acc, cv) => acc + cv.credits, 0)) || 0
    stats.officialAvg = (subjects.reduce((acc, cv) => acc + cv.credits * cv.officialMark, 0)) / (subjects.reduce((acc, cv) => acc + cv.credits, 0)) || 0
    stats.provisionalTakenAvg = (takenSubjects.reduce((acc, cv) => acc + cv.credits * cv.avgMark, 0)) / (takenSubjects.reduce((acc, cv) => acc + cv.credits, 0)) || 0
    stats.officialTakenAvg = (takenSubjects.reduce((acc, cv) => acc + cv.credits * cv.officialMark, 0)) / (takenSubjects.reduce((acc, cv) => acc + cv.credits, 0)) || 0
    if (subjects.length !== 0) {
      stats.topSubjects = subjects.sort(
        function (a, b) {
          return a.officialMark - b.officialMark
        }).slice(-5).map((s) => s.name + ': ' + (s.officialMark || 0) + ' (' + s.credits + ' credits)')
    }
    setStats(stats)
  }, [currentStudies])

  const renderCourse = ({ item }) => {
    return (
      <View style={styles.coursesCard}>
        <Pressable
        style={{ margin: 10 }}
        onPress={() => { navigation.navigate('Course info', { id: item.id, currentStudies }) }}>
          <Text>{courseMapper[item.id]} course</Text>
        </Pressable>
      </View>
    )
  }

  const renderEmptyCourses = () => {
    return (
      <View style={[styles.coursesCard, { alignItems: 'center' }]}>
        <View style={{ margin: 10 }}>
          <Text style={{ textAlign: 'center' }}>No courses found ({currentStudies.years} expected). Do you want to add a new course to {currentStudies.name}?</Text>
          <CourseAdder/>
        </View>
      </View>
    )
  }

  const renderStudiesSelector = () => {
    return (
      <>
        <DropDownPicker
          open={open}
          value={currentStudies.id}
          items={studies}
          setOpen={setOpen}
          onSelectItem={ item => {
            fetchOneStudies(item.value)
          }}
          setItems={setStudies}
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
            ? <View style={{ marginTop: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
            <Text>{currentStudies.courses.length}/{currentStudies.years} courses added.</Text>
            {
              (currentStudies.courses.length !== currentStudies.years) &&
              <CourseAdder/>
            }
          </View>
            : <></>
        }
      </>
    )
  }

  return (
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
          <View style={{ marginLeft: dimensions.window.width > 450 ? 50 : 0, marginTop: dimensions.window.width > 450 ? 0 : 10, alignSelf: dimensions.window.width < 450 ? 'flex-start' : 'center' }}>
            <Text>
              TOP 5 SCORES:
              {
                stats.topSubjects
                  ? stats.topSubjects.map((s) =>
                  <Text key={s}>{'\n\t'} · {s}</Text>
                  )
                  : <Text> No subjects found</Text>
              }
            </Text>
          </View>

        </View>
        {
          renderCourses()
        }

    </View>
  )
}

const styles = StyleSheet.create({
  coursesCard: { backgroundColor: 'white', marginVertical: 5, borderRadius: 15 }
})

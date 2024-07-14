import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet, Dimensions } from 'react-native'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { getAll, getDetail } from '../api/StudiesEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { useIsFocused } from '@react-navigation/native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { ProgressCircle, PieChart } from 'react-native-svg-charts'
import DropDownPicker from 'react-native-dropdown-picker'

export default function CourseInfoScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
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

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text>
      {
        JSON.stringify(route.params.course, null, '\t')
      }
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  coursesCard: { backgroundColor: 'white', marginVertical: 5, borderRadius: 15 }
})

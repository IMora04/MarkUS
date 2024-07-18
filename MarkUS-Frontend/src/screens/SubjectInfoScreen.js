import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, Dimensions, View, Pressable, Switch, ActivityIndicator, ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import * as GlobalStyles from '../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../api/CourseEndpoints'
import * as yup from 'yup'

export default function CourseInfoScreen ({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState()
  const [loading, setLoading] = useState(false)

  const validationSchema = yup.object().shape({
  })

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

  useEffect(() => {
    const fetchOneSubject = async (id) => {
      try {
      } catch (error) {
      }
    }
    // fetchOneSubject(route.params.id)
  }, [route])

  const renderSubject = ({ item }) => {
    return (
        <></>
    )
  }

  return (
    loading
      ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <ActivityIndicator/>
    </View>
      : <ScrollView style={{ padding: 20 }}>
      <Text>
        {
            JSON.stringify(route.params.currentCourse, null, '\t')
        }
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
})

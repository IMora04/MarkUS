import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, Dimensions, View, Pressable, Switch, ActivityIndicator, ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import * as GlobalStyles from '../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../api/SubjectEndpoints'
import * as yup from 'yup'

export default function CourseInfoScreen ({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState()
  const [loading, setLoading] = useState(true)
  const [currentSubject, setCurrentSubject] = useState({})

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

  async function fetchOneSubject (id) {
    try {
      const fetchedSubject = await getDetail(id)
      setCurrentSubject(fetchedSubject)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving this subject. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const evaluableTypes = currentSubject.evaluables
    ? [...new Set(currentSubject.evaluables?.map(e => e.type.name))]
    : []

  useEffect(() => {
    setLoading(true)
    fetchOneSubject(route.params.id)
    setLoading(false)
  }, [route])

  const renderCategories = ({ item }) => {
    return (
      <View>
        <Text style={{ fontSize: 18, marginVertical: 10 }}>{item}s</Text>
        <FlatList
        data={currentSubject.evaluables.filter(e => e.type.name === item)}
        keyExtractor={e => e.id}
        renderItem={renderCategory}
        scrollEnabled={false}
        />
      </View>
    )
  }

  const renderCategory = ({ item }) => {
    return (
      <Text style={{ margin: 2 }}>
        {item.name}: {item.mark ? item.mark : 'No mark yet'} ({item.weight}%)
      </Text>
    )
  }

  return (
    loading
      ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <ActivityIndicator/>
    </View>
      : <View style={{ padding: 20 }}>
      <Text style={{ textAlign: 'center', fontWeight: 600, fontSize: 20, marginBottom: 15 }}>
        {currentSubject.name}
      </Text>
      <FlatList
      scrollEnabled={false}
      data={evaluableTypes}
      renderItem={renderCategories}
      />
    </View>
  )
}

const styles = StyleSheet.create({
})

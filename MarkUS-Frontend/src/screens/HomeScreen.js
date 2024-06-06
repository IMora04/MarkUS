import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { getAll, getOne } from '../api/StudiesEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { FlatList } from 'react-native-gesture-handler'

export default function HomeScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [studies, setStudies] = useState([])

  useEffect(() => {
    async function fetchStudies () {
      try {
        const fetchedStudies = await getAll()
        setStudies(fetchedStudies)
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
  }, [route])

  const renderStudies = ({ item }) => {
    return (
      <View style={{ backgroundColor: 'white', marginVertical: 5, borderRadius: 15 }}>
        <Pressable
        style={{ margin: 10 }}
        onPress={() => { navigation.navigate('MainInfo', { id: item.id }) }}>
          <Text>{item.name}</Text>
          <Text>{item.credits} credits</Text>
          <Text>Currently {item.status}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={{ margin: 20 }}>
      <Text>SELECT YOUR STUDIES</Text>
      <FlatList
      style={{ marginVertical: 10 }}
      data = {studies}
      renderItem={renderStudies}
      keyExtractor={item => item.id.toString()}
      />
    </View>
  )
}

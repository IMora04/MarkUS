import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { getAll } from '../api/StudiesEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { FlatList } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import CreateStudiesModal from '../components/CreateStudiesModal'

export default function StudiesScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [studies, setStudies] = useState([])
  const isFocused = useIsFocused()
  const [showModal, setShowModal] = useState(false)

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
  }, [isFocused, loggedInUser])

  const renderStudies = ({ item }) => {
    return (
      <View style={styles.studiesCard}>
        <Pressable
        style={{ margin: 10 }}
        onPress={() => { navigation.navigate('Studies info', { id: item.id }) }}>
          <Text>{item.name}</Text>
          <Text>{item.credits} credits</Text>
          <Text>Currently {item.status}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={{ margin: 20 }}>
      {
        loggedInUser
          ? <>
            <Text>SELECT YOUR STUDIES</Text>
            <FlatList
            style={{ marginVertical: 10 }}
            data = {studies}
            renderItem={renderStudies}
            keyExtractor={item => item.id.toString()}
            />
            <Pressable
            onPress={() => { setShowModal(true) }}>
              <Text>Add studies</Text>
            </Pressable>
            <CreateStudiesModal
              isVisible={showModal}
              onCancel={() => setShowModal(false)}
              onConfirm={() => {}}
            >
            </CreateStudiesModal>
          </>
          : <Text>You are not logged in</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  studiesCard: { backgroundColor: 'white', marginVertical: 5, borderRadius: 15 }
})

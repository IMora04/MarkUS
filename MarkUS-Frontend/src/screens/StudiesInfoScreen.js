import React, { useContext, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { AuthorizationContext } from '../context/AuthorizationContext'
import { getAll, getOne } from '../api/StudiesEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { FlatList } from 'react-native-gesture-handler'

export default function StudiesInfoScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [studies, setStudies] = useState({})

  useEffect(() => {
    async function fetchOneStudies () {
      try {
        const fetchedStudies = await getOne(route.params.id)
        console.log(fetchedStudies)
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
    fetchOneStudies()
  }, [route])

  return (
    <View style={{ margin: 20 }}>
      <Text>CHANGE STUDIES</Text>
      <Text>
        STUDIES NAME: {studies.name}
      </Text>
      <Text>
        STUDIES AVERAGE MARK
      </Text>
      <Text>
        N OF CREDITS TAKEN
      </Text>
      <Text>
        TOP 5 SCORES
      </Text>
    </View>
  )
}

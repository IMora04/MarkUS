import React, { useContext, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthorizationContext } from '../context/AuthorizationContext'
import StudiesScreen from './StudiesScreen'
import StudiesInfoScreen from './StudiesInfoScreen'

export default function MainStack ({ navigation }) {
  const Stack = createStackNavigator()
  const { loggedInUser } = useContext(AuthorizationContext)

  return (
      <Stack.Navigator initialRouteName='My studies' screenOptions={{
        headerMode: 'float'
      }}>
        <Stack.Screen name="My studies" component={StudiesScreen} />
        <Stack.Screen name="Studies info" component={StudiesInfoScreen} />
      </Stack.Navigator>
  )
}

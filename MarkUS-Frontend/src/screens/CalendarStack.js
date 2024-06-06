import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CalendarScreen from './CalendarScreen'

export default function CalendarStack ({ navigation }) {
  const Stack = createStackNavigator()

  return (
      <Stack.Navigator initialRouteName='StudiesScreen' screenOptions={{
        headerMode: 'float'
      }}>
        <Stack.Screen name="Calendar" component={CalendarScreen}/>
      </Stack.Navigator>
  )
}

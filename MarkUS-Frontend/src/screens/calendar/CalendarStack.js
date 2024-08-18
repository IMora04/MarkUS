import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CalendarScreen from './CalendarScreen'
import BackIcon from '../../components/BackIcon'

export default function CalendarStack ({ navigation }) {
  const Stack = createStackNavigator()

  return (
      <Stack.Navigator initialRouteName='StudiesScreen' screenOptions={{ headerShown: true, headerMode: 'float', headerBackImage: () => <BackIcon /> }}>
        <Stack.Screen name="Calendar" component={CalendarScreen}/>
      </Stack.Navigator>
  )
}

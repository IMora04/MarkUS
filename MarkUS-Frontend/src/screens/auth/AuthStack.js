import React, { useContext, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import ProfileScreen from './ProfileScreen'
import { AuthorizationContext } from '../../context/AuthorizationContext'

export default function AuthStack ({ navigation }) {
  const Stack = createStackNavigator()
  const { loggedInUser } = useContext(AuthorizationContext)

  useEffect(() => {
    if (loggedInUser) {
      navigation.navigate('MainStack')
    }
  }, [loggedInUser])

  return (
      <Stack.Navigator initialRouteName='Login' screenOptions={{
        headerMode: 'float'
      }}>
        {
          loggedInUser
            ? <Stack.Screen name="Profile" component={ProfileScreen}/>
            : <>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
          </>
        }
      </Stack.Navigator>
  )
}

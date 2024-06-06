import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { AuthorizationContext } from '../context/AuthorizationContext'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { ApiError } from '../api/helpers/Errors'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './HomeScreen'
import AuthStack from './AuthStack'
import MainInfoScreen from './MainInfo'

export default function Layout () {
  const { getToken, signOut } = useContext(AuthorizationContext)
  const { error, setError } = useContext(AppContext)

  const Drawer = createDrawerNavigator()

  const init = async () => {
    await getToken(
      (recoveredUser) => {
        showMessage({
          message: `Session recovered. You are logged in as ${recoveredUser.firstName}`,
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      },
      (error) => {
        showMessage({
          message: `Session could not be recovered. Please log in. ${error} `,
          type: 'warning',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    )
  }

  useEffect(() => {
    if (error) {
      showMessage({
        message: error.message,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      if (error instanceof ApiError && (error.code === 403 || error.code === 401)) {
        signOut()
      }
      setError(null)
    }
  }, [error])

  useEffect(() => {
    init()
  }, [])

  return (
    <>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={'Auth'}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Auth" component={AuthStack} options=
        {{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
        />
        <Drawer.Screen name="MainInfo" component={MainInfoScreen} />
      </Drawer.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
    </>
  )
}

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React, { useContext, useEffect } from 'react'
import { Drawer } from 'expo-router/drawer'
import { AppContext } from '../context/AppContext'
import { AuthorizationContext } from '../context/AuthorizationContext'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../styles/GlobalStyles'
import { ApiError } from '../api/helpers/Errors'
import { setStatusBarStyle } from 'expo-status-bar'

export default function Layout () {
  const { getToken, signOut } = useContext(AuthorizationContext)
  const { error, setError } = useContext(AppContext)

  const init = async () => {
    await getToken(
      (recoveredUser) => showMessage({
        message: `Session recovered. You are logged in as ${recoveredUser.firstName}`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      }),
      (error) => showMessage({
        message: `Session could not be recovered. Please log in. ${error} `,
        type: 'warning',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
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
    setStatusBarStyle('inverted')
  }, [])

  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'Home'
          }}
        />
        <Drawer.Screen
          name="marks" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Marks',
            title: 'All my marks'
          }}
        />
        <Drawer.Screen
          name="auth" // This is the name of the page and must match the url from root
          options={{
            unmountOnBlur: true,
            drawerLabel: 'Profile',
            title: 'Profile'
          }}
        />
      </Drawer>
      <FlashMessage position="top" />
    </GestureHandlerRootView>
    </>
  )
}

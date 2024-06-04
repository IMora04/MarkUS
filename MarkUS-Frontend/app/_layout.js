import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React from 'react'
import { Drawer } from 'expo-router/drawer'
import AppContextProvider from '../context/AppContext'
import AuthorizationContextProvider from '../context/AuthorizationContext'

export default function RootLayout () {
  return (
    <AppContextProvider>
    <AuthorizationContextProvider>
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
            name="login" // This is the name of the page and must match the url from root
            options={{
              drawerLabel: 'Login',
              title: 'Login'
            }}
          />
        </Drawer>
      </GestureHandlerRootView>.
    </AuthorizationContextProvider>
    </AppContextProvider>
  )
}

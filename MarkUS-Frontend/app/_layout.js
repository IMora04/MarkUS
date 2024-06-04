import { GestureHandlerRootView } from 'react-native-gesture-handler'

import React from 'react'

import { Drawer } from 'expo-router/drawer'

export default function RootLayout () {
  return (
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
    </GestureHandlerRootView>
  )
}

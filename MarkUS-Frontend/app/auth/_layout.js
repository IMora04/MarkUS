// (auth)/_layout.js
import React, { useContext } from 'react'
import { Stack } from 'expo-router'
import { AuthorizationContext } from '../../context/AuthorizationContext'

export default function AuthLayout ({ children }) {
  const { loggedInUser } = useContext(AuthorizationContext)

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      {
      loggedInUser
        ? <Stack.Screen name="profile" />
        : <Stack.Screen name="login" />
      }
    </Stack>
  )
}

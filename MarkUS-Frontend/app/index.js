import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { Link } from 'expo-router'
import { AuthorizationContext } from '../context/AuthorizationContext'

export default function Home () {
  const { loggedInUser } = useContext(AuthorizationContext)

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {loggedInUser
        ? <Text>Logged In!</Text>
        : <>
        <Text>Not logged in</Text>
        <Link href={'/auth/login'}>Click to log in</Link>
        </>
      }
    </View>
  )
}

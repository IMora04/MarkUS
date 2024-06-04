import { Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const testSubjects = ['ADDA', 'IISSI']

export default function Home () {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Home.</Text>
      <Link href="/marks">View test</Link>
    </View>
  )
}

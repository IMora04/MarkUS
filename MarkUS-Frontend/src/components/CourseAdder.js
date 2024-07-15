import React from 'react'
import { Pressable, Text } from 'react-native'

export default function CourseAdder () {
  return (
    <Pressable style={{ margin: 5, zIndex: 1 }}>
    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Add new course</Text>
    </Pressable>
  )
}

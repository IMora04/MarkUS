import React from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function EditCancelButton (props) {
  return (
    <Pressable
    style={[styles.homeButton, { backgroundColor: props.editing ? 'red' : 'blue' }, props.style]}
    onPress={props.editing ? props.onCancel : props.onEdit}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', width: 120, justifyContent: 'center' }}>
        <MaterialCommunityIcons name={props.editing ? 'cancel' : 'pencil'} color={'white'} size={15}/>
        <Text style={{ margin: 5, color: 'white' }}>{props.editing ? 'Cancel edition' : 'Edit ' + props.name}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  homeButton: {
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 5
  }
})

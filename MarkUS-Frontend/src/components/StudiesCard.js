import React from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function StudiesCard (props) {
  return (
    <View style={styles.studiesCard}>
      {
        props.editing &&
        <Pressable
          style={{ backgroundColor: 'red', borderRadius: 15, height: 30, width: 30, alignItems: 'center', justifyContent: 'center', marginLeft: 5, flexGrow: 0 }}
          onPress={props.onDelete}
        >
          <MaterialCommunityIcons name='delete-outline' color={'white'} size={20}/>
        </Pressable>
      }
      <Pressable
        style={{ padding: 10, flex: 1 }}
        onPress={props.onPress}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontWeight: 630 }}>{props.item.name}</Text>
            <Text>{props.item.credits} credits</Text>
            <Text>Currently {props.item.status}</Text>
          </View>
          {
            props.editing &&
            <View style={{ flexDirection: 'row', width: 55 }}>
              <Text style={{ marginHorizontal: 5, color: 'blue' }}>Edit</Text>
              <MaterialCommunityIcons name='arrow-right' color={'blue'} size={20}/>
            </View>
          }
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  studiesCard: {
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center'
  }
})

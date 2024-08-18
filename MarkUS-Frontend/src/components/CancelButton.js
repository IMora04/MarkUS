import React from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import * as GlobalStyles from '../styles/GlobalStyles'

export default function CancelButton (props) {
  return (
    <Pressable
    onPress={props.onCancel}
    style={({ pressed }) => [
      {
        borderColor: GlobalStyles.appBlue,
        borderWidth: 1
      },
      styles.actionButton]}
    >
    <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
    <Text style={[styles.text, { color: 'f5f5f5' }]}>
        Cancel
    </Text>
    </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 8,
    height: 40,
    margin: 8,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  text: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    marginLeft: 5
  }
})

import React from 'react'
import { Modal, Pressable, StyleSheet, View, Text } from 'react-native'
import { BlurView } from 'expo-blur'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as GlobalStyles from '../styles/GlobalStyles'

export default function DeleteModal (props) {
  return (
    <>
      {
        props.isVisible &&
        <BlurView
        style={styles.absolute}
        tint="light"
        intensity={10}
        experimentalBlurMethod='dimezisBlurView'
        />
      }
      <Modal
      presentationStyle='overFullScreen'
      animationType='fade'
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.onCancel}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.text}>Are you sure you want to delete these studies?</Text>
              <Text style={styles.text}>All courses, subjects and marks will be deleted as well.</Text>
            </View>

            <Pressable
              onPress={props.onCancel}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandSuccessTap
                    : GlobalStyles.brandSuccess
                },
                styles.actionButton]}
            >
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
              <Text style={[styles.text, { color: 'white' }]}>
                  Cancel
              </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={props.onConfirm}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandPrimaryTap
                    : GlobalStyles.brandPrimary
                },
                styles.actionButton]}
            >
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
              <Text style={[styles.text, { color: 'white' }]}>
                  Confirm
              </Text>
              </View>
            </Pressable>

          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 5,
    width: '80%'
  },
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
    alignSelf: 'start',
    marginLeft: 5
  },
  absolute: {
    position: 'absolute',
    top: -20,
    left: -20,
    bottom: -20,
    right: -20
  }
})

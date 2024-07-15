import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { BlurView } from 'expo-blur'

export default function CreateStudiesModal (props) {
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

            {props.children}

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
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 5,
    width: '90%'
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
    color: 'white',
    alignSelf: 'center',
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

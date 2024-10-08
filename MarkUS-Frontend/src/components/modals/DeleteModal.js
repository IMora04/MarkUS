import React from "react";
import { Modal, Pressable, StyleSheet, View, Text } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as GlobalStyles from "../../styles/GlobalStyles";
import CancelButton from "../buttons/CancelButton";

export default function DeleteModal(props) {
  let deleteText;
  switch (props.name) {
    case "studies":
      deleteText =
        "All its courses, subjects and marks will be deleted as well";
      break;
    case "course":
      deleteText = "All its subjects and marks will be deleted as well";
      break;
    case "subject":
      deleteText = "All its evaluables and marks will be deleted as well";
      break;
    default:
      deleteText = "All its info will be deleted as well";
  }

  return (
    <Modal
      presentationStyle="overFullScreen"
      animationType="fade"
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.onCancel}
    >
      <BlurView
        style={styles.absolute}
        tint="light"
        intensity={10}
        experimentalBlurMethod="dimezisBlurView"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.text, { fontWeight: 600, fontSize: 20 }]}>
              Delete {props.name}
            </Text>
            <View>
              <Text style={styles.text}>
                {"\n"}Are you sure you want to delete this {props.name}?
              </Text>
              <Text style={styles.text}>
                {"\n"}
                {deleteText}
              </Text>
            </View>

            <Pressable
              onPress={props.onConfirm}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.appRedTap
                    : GlobalStyles.appRed,
                  marginTop: 35,
                },
                styles.actionButton,
              ]}
            >
              <View
                style={[
                  { flex: 1, flexDirection: "row", justifyContent: "center" },
                ]}
              >
                <MaterialCommunityIcons
                  name="delete"
                  color={"white"}
                  size={20}
                />
                <Text style={[styles.text, { color: "white" }]}>Delete</Text>
              </View>
            </Pressable>

            <CancelButton onCancel={props.onCancel} />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    margin: 8,
    padding: 10,
    alignSelf: "center",
    flexDirection: "column",
    width: "50%",
  },
  text: {
    fontSize: 16,
    color: "black",
    textAlign: "left",
    marginLeft: 5,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

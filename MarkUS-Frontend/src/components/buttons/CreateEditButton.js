import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import * as GlobalStyles from "../../styles/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CancelButton(props) {
  return (
    <Pressable
      onPress={props.editing ? props.onEdit : props.onCreate}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? GlobalStyles.appGreenTap
            : GlobalStyles.appGreen,
        },
        styles.actionButton,
      ]}
    >
      <View
        style={[{ flex: 1, flexDirection: "row", justifyContent: "center" }]}
      >
        <MaterialCommunityIcons
          name={props.editing ? "content-save" : "check"}
          color={"white"}
          size={20}
        />
        <Text style={styles.text}>{props.editing ? "Confirm" : "Create"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    textAlign: "center",
    color: "white",
    marginLeft: 5,
  },
});

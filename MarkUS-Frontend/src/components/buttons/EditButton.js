import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as GlobalStyles from "../../styles/GlobalStyles";

export default function EditButton(props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.homeButton,
        {
          backgroundColor: pressed
            ? GlobalStyles.appBlueTap
            : GlobalStyles.appBlue,
        },
        props.style,
      ]}
      onPress={props.onEdit}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: 120,
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name={"pencil"} color={"white"} size={15} />
        <Text style={{ margin: 5, color: "white", fontSize: 15 }}>
          Edit {props.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});

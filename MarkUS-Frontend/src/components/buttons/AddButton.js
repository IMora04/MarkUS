import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as GlobalStyles from "../../styles/GlobalStyles";

export default function AddButton(props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.homeButton,
        {
          backgroundColor: pressed
            ? GlobalStyles.appGreenTap
            : GlobalStyles.appGreen,
        },
        props.style,
      ]}
      onPress={props.onCreate}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="plus" color={"white"} size={20} />
        <Text style={{ margin: 5, color: "white", fontSize: 15 }}>
          Add {props.name}
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

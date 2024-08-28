import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as GlobalStyles from "../styles/GlobalStyles";

export default function AppCard(props) {
  return (
    <View style={[props.style, styles.card]}>
      {props.editing && (
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.appRedTap
                : GlobalStyles.appRed,
            },
            styles.deleteBox,
          ]}
          onPress={props.onDelete}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            color={"white"}
            size={20}
          />
        </Pressable>
      )}
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: "white",
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  deleteBox: {
    borderRadius: 15,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});

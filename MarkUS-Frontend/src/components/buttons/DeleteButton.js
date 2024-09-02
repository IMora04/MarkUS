import React from "react";
import { Pressable, View, Text } from "react-native";
import * as GlobalStyles from "../../styles/GlobalStyles";

export default function DeleteButton(props) {
  return (
    <View style={{ marginTop: 30 }}>
      <Pressable onPress={props.onDelete}>
        <Text style={{ color: GlobalStyles.appRed, textAlign: "center" }}>
          Delete this {props.name}
        </Text>
      </Pressable>
    </View>
  );
}

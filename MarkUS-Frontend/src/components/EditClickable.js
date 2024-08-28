import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as GlobalStyles from "../styles/GlobalStyles";

export default function EditClickable(props) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <MaterialCommunityIcons
        name="pencil"
        color={GlobalStyles.appBlue}
        size={20}
      />
      {!props.hideText && (
        <Text style={{ marginHorizontal: 5, color: GlobalStyles.appBlue }}>
          Edit
        </Text>
      )}
    </View>
  );
}

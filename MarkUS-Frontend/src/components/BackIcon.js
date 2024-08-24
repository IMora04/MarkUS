import React from "react";
import { Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function BackIcon(props) {
  return (
    <Icon
      name="chevron-left"
      size={30}
      color={Platform.OS === "ios" ? "#007AFF" : "#1a1a1a"}
      {...props}
    />
  );
}

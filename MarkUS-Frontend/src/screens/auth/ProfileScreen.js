import React, { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AuthorizationContext } from "../../context/AuthorizationContext";
import * as GlobalStyles from "../../styles/GlobalStyles";
import { showMessage } from "react-native-flash-message";

export default function ProfileScreen({ navigation, route }) {
  const { loggedInUser, signOut, updateProfile } =
    useContext(AuthorizationContext);

  useEffect(() => {
    if (!loggedInUser) {
      navigation.navigate("Login");
    }
  }, [route]);

  const signOutAndNavigate = () => {
    signOut(() =>
      showMessage({
        message: "See you soon",
        type: "success",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
        backgroundColor: GlobalStyles.brandSecondary,
      }),
    );
  };

  return (
    <View style={{ margin: 20 }}>
      <Text>Test profile screen</Text>
      <Pressable
        onPress={() => {
          signOutAndNavigate();
        }}
      >
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}

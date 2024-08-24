import React, { useContext, useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
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
    <View style={{ padding: 20 }}>
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 500 }}>
        Hi {loggedInUser?.firstName}!
      </Text>

      <View style={{ marginVertical: 15 }}>
        <Text style={styles.text}>First name: {loggedInUser?.firstName}</Text>
        <Text style={styles.text}>Last name: {loggedInUser?.lastName}</Text>
        <Text style={styles.text}>Email: {loggedInUser?.email}</Text>
      </View>

      <Pressable
        onPress={() => {
          signOutAndNavigate();
        }}
      >
        <Text
          style={{
            color: GlobalStyles.appRed,
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Sign out
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    textAlign: "left",
    margin: 3,
  },
});

import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as GlobalStyles from "../styles/GlobalStyles";
import EditClickable from "./EditClickable";

export default function StudiesCard(props) {
  return (
    <View style={styles.studiesCard}>
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
      <Pressable
        style={({ pressed }) => [
          {
            padding: 10,
            flex: 1,
            borderRadius: 15,
            backgroundColor: pressed ? GlobalStyles.appWhiteTap : "white",
          },
        ]}
        onPress={props.onPress}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontWeight: 600, fontSize: 16 }}>
              {props.item.name}
            </Text>
            <Text style={{ fontSize: 15 }}>{props.item.credits} credits</Text>
            <Text style={{ fontSize: 15 }}>Currently {props.item.status}</Text>
          </View>
          {props.editing && <EditClickable />}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  studiesCard: {
    borderRadius: 15,
    backgroundColor: "white",
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteBox: {
    borderRadius: 15,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});

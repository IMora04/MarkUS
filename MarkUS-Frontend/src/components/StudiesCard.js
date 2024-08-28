import React from "react";
import { Pressable, View, Text } from "react-native";
import * as GlobalStyles from "../styles/GlobalStyles";
import EditClickable from "./EditClickable";
import AppCard from "./AppCard";

export default function StudiesCard(props) {
  return (
    <AppCard editing={props.editing} onDelete={props.onDelete}>
      <Pressable
        style={({ pressed }) => [
          {
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
    </AppCard>
  );
}

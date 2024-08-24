import React from "react";
import { View } from "react-native";
import AddButton from "./AddButton";
import EditButton from "./EditButton";
import CancelButton from "./CancelButton";

export default function DoubleButtons(props) {
  return (
    <>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: props.width > 450 ? "flex-end" : "space-around",
          },
          props.style,
        ]}
      >
        {!props.editing && (
          <>
            <AddButton onCreate={props.onCreate} name={props.name} />
            <EditButton
              name={props.name}
              editing={props.editing}
              onCancel={props.onCancel}
              onEdit={props.onEdit}
            />
          </>
        )}
        {props.editing && (
          <CancelButton
            style={{ width: props.width < 450 ? "80%" : "9%", marginTop: 0 }}
            onCancel={props.onCancel}
          />
        )}
      </View>
    </>
  );
}

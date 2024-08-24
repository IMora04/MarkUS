import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import * as GlobalStyles from "../styles/GlobalStyles";

export default function TopSubjects(props) {
  return (
    <>
      {props.topSubjects?.length === 0 ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center" }}>
            Start adding subjects to see the top 5 subjects
          </Text>
        </View>
      ) : (
        <View style={[{ marginLeft: 0, alignSelf: "center" }, props.style]}>
          <Text style={{ textAlign: "center", fontSize: 15, marginBottom: 10 }}>
            Top 5 subjects
          </Text>
          <BarChart
            frontColor={GlobalStyles.appPurple}
            disableScroll={true}
            barWidth={props.width < 450 ? props.width / 15 : 40}
            data={props.topSubjects}
            stepHeight={20}
            barBorderTopLeftRadius={5}
            barBorderTopRightRadius={5}
          />
        </View>
      )}
    </>
  );
}

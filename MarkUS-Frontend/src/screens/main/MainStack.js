import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StudiesScreen from "./StudiesScreen";
import StudiesInfoScreen from "./StudiesInfoScreen";
import CourseInfoScreen from "./CourseInfoScreen";
import SubjectInfoScreen from "./SubjectInfoScreen";

import BackIcon from "../../components/BackIcon";

export default function MainStack({ navigation }) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="My studies"
      screenOptions={{
        headerShown: true,
        headerMode: "float",
        headerBackImage: () => <BackIcon />,
      }}
    >
      <Stack.Screen name="My studies" component={StudiesScreen} />
      <Stack.Screen name="Studies info" component={StudiesInfoScreen} />
      <Stack.Screen name="Course info" component={CourseInfoScreen} />
      <Stack.Screen name="Subject info" component={SubjectInfoScreen} />
    </Stack.Navigator>
  );
}

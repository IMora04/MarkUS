import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { AuthorizationContext } from "../context/AuthorizationContext";
import FlashMessage, { showMessage } from "react-native-flash-message";
import * as GlobalStyles from "../styles/GlobalStyles";
import { ApiError } from "../api/helpers/Errors";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./main/MainStack";
import AuthStack from "./auth/AuthStack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CalendarStack from "./calendar/CalendarStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  const { getToken, signOut } = useContext(AuthorizationContext);
  const { error, setError } = useContext(AppContext);

  const Tab = createBottomTabNavigator();

  FlashMessage.setColorTheme({
    success: GlobalStyles.appGreenTap,
    info: GlobalStyles.appPurpleTap,
    warning: GlobalStyles.appOrangeTap,
    danger: GlobalStyles.appRedTap,
  });

  const init = async () => {
    await getToken(
      (recoveredUser) => {
        showMessage({
          message: `Session recovered. You are logged in as ${recoveredUser.firstName}`,
          type: "success",
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        });
      },
      (error) => {
        showMessage({
          message: `Session could not be recovered. Please log in. ${error} `,
          type: "warning",
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle,
        });
      },
    );
  };

  useEffect(() => {
    if (error) {
      showMessage({
        message: error.message,
        type: "danger",
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle,
      });
      if (
        error instanceof ApiError &&
        (error.code === 403 || error.code === 401)
      ) {
        signOut();
      }
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={"AuthStack"}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              const icons = {
                MainStack: "notebook",
                CalendarStack: "calendar",
                AuthStack: "account",
              };

              return (
                <MaterialCommunityIcons
                  name={icons[route.name]}
                  color={color}
                  size={size}
                />
              );
            },
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="MainStack"
            options={{ title: "Studies" }}
            component={MainStack}
          />
          <Tab.Screen
            name="CalendarStack"
            options={{ title: "Calendar" }}
            component={CalendarStack}
          />
          <Tab.Screen
            name="AuthStack"
            options={{ title: "Profile" }}
            component={AuthStack}
          />
        </Tab.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
    </>
  );
}

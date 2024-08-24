import React from "react";
import AppContextProvider from "./src/context/AppContext";
import AuthorizationContextProvider from "./src/context/AuthorizationContext";
import StudiesContextProvider from "./src/context/StudiesContext";
import Layout from "./src/screens/Layout";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  return (
    <AppContextProvider>
      <AuthorizationContextProvider>
        <StudiesContextProvider>
          <Layout />
        </StudiesContextProvider>
      </AuthorizationContextProvider>
    </AppContextProvider>
  );
}

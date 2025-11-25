// src/App.tsx
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Platform, StatusBar, View } from "react-native";
import "./global.css";
import MainNavigator from "./navigators/MainNavigator";

export default function App() {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
  
  return (
    <View style={{ flex: 1, paddingTop: statusBarHeight }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </View>
  );
}

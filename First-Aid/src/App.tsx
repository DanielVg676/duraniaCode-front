// src/App.tsx
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import "./global.css";
import MainNavigator from "./navigators/MainNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

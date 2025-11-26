// src/App.tsx
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Platform, StatusBar, View } from "react-native";
import "./global.css";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import MainNavigator from "./navigators/MainNavigator";

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f8fafc',
  },
};

const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#1a1d23',
    card: '#1f2329',
    text: '#f1f5f9',
    border: '#2d3139',
    notification: '#3b82f6',
    primary: '#3b82f6',
  },
};

function AppContent() {
  const { isDarkMode } = useTheme();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
  const navigationRef = React.useRef(null);
  
  return (
    <View style={{ flex: 1, paddingTop: statusBarHeight }}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      <NavigationContainer ref={navigationRef} theme={isDarkMode ? darkTheme : lightTheme}>
        <MainNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

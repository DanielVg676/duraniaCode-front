// src/navigators/MainNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// IMPORTA el navbar personalizado
import CustomNavBar from "../components/CustomNavBar";
// IMPORTA las pantallas
import ChatScreen from "../screens/ChatScreen";
import ChecklistScreen from "../screens/ChecklistScreen";
import GuideDetailScreen from "../screens/GuideDetailScreen";
import HomeScreen from "../screens/HomeScreen";
import KitScreen from "../screens/KitScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";

export type TabParamList = {
  Inicio: undefined;
  Buscar: undefined;
  ChatIA: undefined;
  Config: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Checklist: undefined;
  Kit: undefined;
  GuideDetail: { guideId: string };
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomNavBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarLabel: "Inicio",
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={SearchScreen}
        options={{
          tabBarLabel: "Buscar",
        }}
      />
      <Tab.Screen
        name="ChatIA"
        component={ChatScreen}
        options={{
          tabBarLabel: "Chat IA",
        }}
      />
      <Tab.Screen
        name="Config"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Config",
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{ title: "Checklist de Preparación" }}
      />
      <Stack.Screen
        name="Kit"
        component={KitScreen}
        options={{ title: "Kit de Emergencia" }}
      />
      <Stack.Screen
        name="GuideDetail"
        options={{ title: "Guía de Emergencia" }}
      >
        {({ route, navigation }) => (
          <GuideDetailScreen
            guideId={route.params.guideId}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MainNavigator;

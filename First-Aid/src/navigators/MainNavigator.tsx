// src/navigators/MainNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, MessageCircle, Search, Settings } from "lucide-react-native";
import React from "react";

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
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ChatIA"
        component={ChatScreen}
        options={{
          tabBarLabel: "Chat IA",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Config"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Config.",
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
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

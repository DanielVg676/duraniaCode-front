import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { isDarkMode } = useTheme();
  const colorScheme = useColorScheme();
  const isDark = isDarkMode || colorScheme === 'dark';

  const PRIMARY_COLOR = isDark ? "#1e293b" : "#002e90"; 
  const SECONDARY_COLOR = "#fff";
  const ICON_ACTIVE_COLOR = isDark ? "#60a5fa" : "#002e90";
  const ICON_INACTIVE_COLOR = isDark ? "#94a3b8" : "#fff";
  
  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      style={[styles.container, { backgroundColor: PRIMARY_COLOR }]}
    >
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? SECONDARY_COLOR : "transparent" },
            ]}
          >
            {getIconByRouteName(
              route.name,
              isFocused ? ICON_ACTIVE_COLOR : ICON_INACTIVE_COLOR
            )}

          </AnimatedTouchableOpacity>
        );
      })}
    </Animated.View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case "Inicio":
        return <Feather name="home" size={20} color={color} />;
      case "Buscar":
        return <Feather name="search" size={20} color={color} />;
      case "ChatIA":
        return <Ionicons name="chatbubble-ellipses-outline" size={20} color={color} />;
      case "Config":
        return <FontAwesome6 name="gear" size={20} color={color} />;
      default:
        return <Feather name="home" size={20} color={color} />;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    bottom: 20,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: "#002e90",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    width: 44,
    borderRadius: 30,
    flex: 1,
  },
});

export default CustomNavBar;
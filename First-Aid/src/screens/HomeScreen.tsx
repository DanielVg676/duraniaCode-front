// src/screens/HomeScreen.tsx
import { Card, CardContent } from "@/components/ui/Card";
import {
  Activity,
  Droplet,
  Flame,
  Heart,
  PackageCheck,
  Shield,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
const LifeAidLogo = require("@/assets/lifeaid.png");

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const emergencyCategories = [
    {
      id: "cpr",
      title: "RCP",
      description: "Reanimación Cardiopulmonar",
      icon: Heart,
      color: "#ef4444", // text-emergency (ajusta al color de tu tema)
    },
    {
      id: "bleeding",
      title: "Hemorragias",
      description: "Control de sangrado",
      icon: Droplet,
      color: "#ef4444",
    },
    {
      id: "burns",
      title: "Quemaduras",
      description: "Tratamiento de quemaduras",
      icon: Flame,
      color: "#f97316", // text-warning
    },
    {
      id: "fractures",
      title: "Fracturas",
      description: "Primeros auxilios para huesos",
      icon: Shield,
      color: "#3b82f6", // text-primary
    },
    {
      id: "choking",
      title: "Ahogamiento",
      description: "Maniobra de Heimlich",
      icon: Activity,
      color: "#ef4444",
    },
    {
      id: "seizures",
      title: "Convulsiones",
      description: "Manejo de crisis epilépticas",
      icon: Activity,
      color: "#f97316",
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 pb-20"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="bg-primary items-center justify-center py-8 px-6">
          <Image
            source={LifeAidLogo}
            resizeMode="contain"
            className="h-28 w-28 mb-2"
          />
        </View>

        {/* Content */}
        <View className="p-4">
          {/* Categories Grid */}
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Guías de Primeros Auxilios
            </Text>

            <View className="flex-row flex-wrap -mx-1">
              {emergencyCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <View key={category.id} className="w-1/2 px-1 mb-3">
                    <Card
                      className="transition-shadow"
                      onPress={() => navigation?.navigate("GuideDetail", { guideId: category.id })}
                    >
                      <CardContent className="p-4 items-center">
                        <Icon
                          size={32}
                          color={category.color}
                          style={{ marginBottom: 8 }}
                        />
                        <Text className="font-semibold text-sm mb-1 text-foreground text-center">
                          {category.title}
                        </Text>
                        <Text className="text-xs text-muted-foreground text-center">
                          {category.description}
                        </Text>
                      </CardContent>
                    </Card>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Quick Preparation */}
          <View className="mt-8 space-y-3">
            <Text className="text-lg font-semibold mb-4">
              Preparación
            </Text>

            {/* Kit de Emergencia */}
            <Card
              onPress={() => navigation?.navigate("Kit")}
              className="transition-shadow"
            >
              <CardContent className="p-4 flex-row items-center">
                <Shield
                  size={24}
                  color="#22c55e"
                  style={{ marginRight: 16 }}
                />
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    Kit de Emergencia
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Ver contenido recomendado
                  </Text>
                </View>
              </CardContent>
            </Card>

            {/* Checklist de Preparación */}
            <Card
              onPress={() => navigation?.navigate("Checklist")}
              className="transition-shadow"
            >
              <CardContent className="p-4 flex-row items-center">
                <PackageCheck
                  size={24}
                  color="#3b82f6"
                  style={{ marginRight: 16 }}
                />
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    Checklist de Preparación
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Marca lo que ya tienes listo
                  </Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

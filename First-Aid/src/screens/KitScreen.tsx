// src/screens/KitScreen.tsx
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
    ArrowLeft,
    Battery,
    BriefcaseMedical,
    Droplet,
    Utensils,
    Zap,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

interface KitScreenProps {
  onBack?: () => void;
  navigation?: any;
}

const KitScreen: React.FC<KitScreenProps> = ({ onBack, navigation }) => {
  const kitItems = [
    {
      id: "botiquin",
      label: "Botiquín de primeros auxilios",
      icon: BriefcaseMedical,
    },
    { id: "agua", label: "Botellas de agua", icon: Droplet },
    {
      id: "alimentos",
      label: "Alimentos no perecederos",
      icon: Utensils,
    },
    { id: "linterna", label: "Linterna y pilas", icon: Zap },
    {
      id: "powerbank",
      label: "Batería externa (Power Bank)",
      icon: Battery,
    },
  ];

  return (
    <View className="flex-1 p-4 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      {onBack && (
        <View className="flex-row items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onPress={onBack || (() => navigation?.goBack())}
            className="h-10 w-10 items-center justify-center"
          >
            <ArrowLeft size={20} color="#4b5563" />
          </Button>
          <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-3">Kit de Emergencia</Text>
        </View>
      )}

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="space-y-4">
          {kitItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.id} className="mb-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="flex-row items-center p-4">
                  <Icon
                    size={24}
                    color="#3b82f6"
                    style={{ marginRight: 16 }}
                  />
                  <Text className="font-medium text-slate-800 dark:text-slate-100">
                    {item.label}
                  </Text>
                </CardContent>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default KitScreen;

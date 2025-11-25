// src/screens/ChecklistScreen.tsx
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { ArrowLeft, CheckSquare } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface ChecklistScreenProps {
  onBack?: () => void;
  navigation?: any;
}

const ChecklistScreen: React.FC<ChecklistScreenProps> = ({ onBack, navigation }) => {
  const initialItems = [
    { id: "agua", label: "Botellas de agua", checked: false },
    { id: "comida", label: "Comida enlatada", checked: false },
    { id: "radio", label: "Radio portátil", checked: false },
    { id: "linterna", label: "Linterna y pilas", checked: false },
    { id: "documentos", label: "Documentos importantes", checked: false },
  ];

  const [items, setItems] = useState(initialItems);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <View className="flex-1 p-4">
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
          <Text className="text-xl font-bold ml-3">
            Checklist de Preparación
          </Text>
        </View>
      )}

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="space-y-4">
          {items.map((item) => (
            <Card
              key={item.id}
              onPress={() => toggleItem(item.id)}
              className="mb-3"
            >
              <CardContent className="flex-row items-center p-4">
                <Checkbox
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  className="mr-4"
                />
                <Text
                  className={`font-medium ${
                    item.checked
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </Text>
              </CardContent>
            </Card>
          ))}
        </View>

        <Button
          onPress={() =>
            setItems((prev) =>
              prev.map((i) => ({ ...i, checked: true }))
            )
          }
          className="w-full mt-6 flex-row items-center justify-center"
        >
          <CheckSquare size={20} color="#ffffff" />
          <Text className="ml-2 text-white font-medium">
            Marcar todo como listo
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
};

export default ChecklistScreen;

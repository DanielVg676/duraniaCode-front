// src/screens/ChecklistScreen.tsx
import { Checkbox } from "@/components/ui/Checkbox";
import { ArrowLeft, CheckCircle2, ListTodo } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, Animated } from "react-native";
import { StatusBar } from 'expo-status-bar';

interface ChecklistScreenProps {
  onBack?: () => void;
  navigation?: any;
}

const ChecklistScreen: React.FC<ChecklistScreenProps> = ({ onBack, navigation }) => {
  const initialItems = [
    { id: "agua", label: "Botellas de agua (3 días)", checked: false },
    { id: "comida", label: "Comida enlatada", checked: false },
    { id: "radio", label: "Radio portátil / pilas", checked: false },
    { id: "linterna", label: "Linterna potente", checked: false },
    { id: "docs", label: "Docs. en bolsa hermética", checked: false },
    { id: "dinero", label: "Dinero en efectivo", checked: false },
    { id: "llaves", label: "Copia de llaves (casa/auto)", checked: false },
  ];

  const [items, setItems] = useState(initialItems);

  // Cálculo del progreso
  const totalItems = items.length;
  const completedItems = items.filter(i => i.checked).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const markAll = () => {
    setItems((prev) => prev.map((i) => ({ ...i, checked: true })));
  };

  const handleBack = onBack || (() => navigation?.goBack());

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style="light" />

      {/* Header Branding #002e90 */}
      <View className="bg-[#002e90] pt-12 pb-10 px-6 rounded-b-[32px] shadow-sm mb-6 relative">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={handleBack}
            className="bg-white/20 p-2 rounded-full mr-4"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Preparación</Text>
        </View>

        {/* Tarjeta de Progreso Flotante (Incrustada en el header) */}
      <View className="flex-row items-center justify-center">
        <View className="items-center">
          <Text className="text-blue-200 text-md font-medium mb-1">
            Tu Progreso
          </Text>
          <Text className="text-white text-4xl font-bold">
            {progressPercent}%
          </Text>
        </View>
      </View>

      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Barra de Progreso Visual */}
        <View className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
            <View 
                style={{ width: `${progressPercent}%` }} 
                className="h-full bg-green-500 rounded-full" 
            />
        </View>

        <View className="space-y-3">
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => toggleItem(item.id)}
              className={`flex-row items-center p-4 rounded-2xl border mb-3 ${
                  item.checked 
                  ? "bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:border-slate-800" 
                  : "bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 shadow-sm"
              }`}
            >
                {/* Custom Checkbox UI para mejor control visual */}
                <View className={`h-6 w-6 rounded-md border-2 mr-4 items-center justify-center ${
                    item.checked 
                    ? "bg-green-500 border-green-500" 
                    : "border-slate-300 bg-white"
                }`}>
                    {item.checked && <CheckCircle2 size={14} color="white" strokeWidth={4} />}
                </View>

                <Text
                  className={`flex-1 text-base font-medium ${
                    item.checked
                      ? "line-through text-slate-400 dark:text-slate-500"
                      : "text-slate-800 dark:text-slate-100"
                  }`}
                >
                  {item.label}
                </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Botón Flotante Inferior */}
      <View className="absolute bottom-6 left-5 right-5">
        <TouchableOpacity
          onPress={() => {
            if (completedItems === totalItems) {
              // Desmarcar todo
              setItems((prev) => prev.map((i) => ({ ...i, checked: false })));
            } else {
              // Marcar todo
              setItems((prev) => prev.map((i) => ({ ...i, checked: true })));
            }
          }}
          activeOpacity={0.8}
          className={`py-4 rounded-2xl flex-row items-center justify-center shadow-lg
            ${completedItems === totalItems ? "bg-red-600" : "bg-green-600"}`}
        >
          <CheckCircle2 size={20} color="#ffffff" />

          <Text className="ml-2 text-white font-bold text-lg">
            {completedItems === totalItems ? "Desmarcar todo" : "Marcar todo listo"}
          </Text>
        </TouchableOpacity>
      </View>


    </View>
  );
};

export default ChecklistScreen;
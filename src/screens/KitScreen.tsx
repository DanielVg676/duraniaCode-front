// src/screens/KitScreen.tsx
import { Button } from "@/components/ui/Button";
import {
    ArrowLeft,
    Battery,
    BriefcaseMedical,
    Droplet,
    Utensils,
    Zap,
    Info
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from 'expo-status-bar';

interface KitScreenProps {
  onBack?: () => void;
  navigation?: any;
}

const KitScreen: React.FC<KitScreenProps> = ({ onBack, navigation }) => {
  const kitItems = [
    {
      id: "botiquin",
      label: "Botiquín Básico",
      desc: "Vendas, alcohol, gasas y tijeras.",
      icon: BriefcaseMedical,
    },
    { 
      id: "agua", 
      label: "Agua Potable", 
      desc: "Mínimo 1 litro por persona al día.",
      icon: Droplet 
    },
    {
      id: "alimentos",
      label: "Alimentos",
      desc: "No perecederos y abrelatas manual.",
      icon: Utensils,
    },
    { 
      id: "linterna", 
      label: "Iluminación", 
      desc: "Linterna LED y pilas de repuesto.",
      icon: Zap 
    },
    {
      id: "powerbank",
      label: "Energía",
      desc: "Power Bank cargada para tu celular.",
      icon: Battery,
    },
  ];

  const handleBack = onBack || (() => navigation?.goBack());

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style="light" />
      
      {/* Nuevo Header Branding #002e90 */}
      <View className="bg-[#002e90] pt-12 pb-8 px-6 rounded-b-[32px] shadow-sm mb-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={handleBack}
            className="bg-white/20 p-2 rounded-full mr-4"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View>
             <Text className="text-2xl font-bold text-white">Kit de Emergencia</Text>
             <Text className="text-blue-200 text-sm">Elementos esenciales</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 24 }}>
        
        {/* Tarjeta de Información rápida */}
        <View className="bg-blue-50 dark:bg-slate-800 p-4 rounded-2xl mb-6 flex-row border border-blue-100 dark:border-slate-700">
            <Info size={24} color="#002e90" style={{marginRight: 12, marginTop: 2}}/>
            <Text className="flex-1 text-slate-600 dark:text-slate-300 text-md leading-5">
                Mantén tu kit en una mochila accesible y revisa la caducidad de los alimentos cada 6 meses.
            </Text>
        </View>

        <View className="space-y-4">
          {kitItems.map((item) => {
            const Icon = item.icon;
            return (
              <View 
                key={item.id} 
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex-row items-center mb-3"
              >
                {/* Contenedor del Icono Visualmente Atractivo */}
                <View className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-4">
                    <Icon size={24} color="#002e90" />
                </View>
                
                <View className="flex-1">
                  <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {item.label}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-sm">
                    {item.desc}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default KitScreen;
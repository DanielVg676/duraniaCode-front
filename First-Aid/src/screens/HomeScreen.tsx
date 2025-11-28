// src/screens/HomeScreen.tsx
import ContactManager from "@/components/ContactManager";
import SosButtonNative from "@/components/SosButtonNative";
import { StatusBar } from "expo-status-bar";
import {
  Activity,
  Bot,
  Droplet,
  Flame,
  Heart,
  PackageCheck,
  Phone,
  Shield,
  Zap,
  UsersRound,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  isMonitoringActive,
  startCrashMonitoring,
  stopCrashMonitoring,
} from "../native/crash";

const LifeAidLogo = require("@/assets/logo.png");

// --- CONSTANTES DE DISEÑO ---
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.9; // Más grande
const SPACING_FOR_CARD_INSET = (SCREEN_WIDTH - CARD_WIDTH) / 2;

interface HomeScreenProps {
  navigation?: any;
}

interface CarouselItem {
  id: string;
  title: string;
  renderContent: () => React.ReactElement;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const active = await isMonitoringActive();
        setIsMonitoring(active);
      } catch (error) {
        console.error("Error checking monitoring status:", error);
      }
    }}, []);

  // ++ AÑADIR FUNCIÓN PARA CONTROLAR EL INTERRUPTOR ++
  const toggleMonitoring = async (isActive: boolean) => {
    setIsMonitoring(isActive);
    try {
      if (isActive) {
        await startCrashMonitoring();
      } else {
        await stopCrashMonitoring();
      }
    } catch (error) {
      console.error("Failed to toggle crash monitoring:", error);
      // Revertir el estado si hay un error
      setIsMonitoring(!isActive);
    }
  };

  const slides: CarouselItem[] = [
    {
      id: "sos",
      title: "Botón de Emergencia",
      renderContent: () => (
        <View className="bg-white dark:bg-slate-800 rounded-3xl shadow-ls border border-slate-200 dark:border-slate-700 p-6 items-center justify-center h-full">
          <View className="flex-row items-center mb-3">
            <Text className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Botón SOS
            </Text>
          </View>
          <SosButtonNative contacts={emergencyContacts} />
        </View>
      ),
    },
    {
      id: "contacts",
      title: "Contactos de Emergencia",
      renderContent: () => (
        <View className="bg-white dark:bg-slate-800 rounded-3xl shadow-ls border border-slate-200 dark:border-slate-700 p-6 h-full">
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-100 p-2 rounded-2xl mr-2">
              <UsersRound size={28} color="#2563eb" />
            </View>
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Contactos de Emergencia
            </Text>
          </View>
          <ContactManager onContactsChange={setEmergencyContacts} />
        </View>
      ),
    },
    {
      id: "ai",
      title: "Asistente IA",
      renderContent: () => (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation?.navigate("ChatIA")}
          className="bg-[#002e90] rounded-3xl shadow-ls h-full overflow-hidden relative"
        >
          {/* Fondos decorativos */}
          <View className="absolute top-[-30] right-[-30] w-40 h-40 bg-white/10 rounded-full" />
          <View className="absolute bottom-[-20] left-[-20] w-32 h-32 bg-white/5 rounded-full" />

          <View className="flex-1 items-center justify-center p-6">
            <View className="bg-white/20 p-5 rounded-3xl mb-5 backdrop-blur-sm">
              <Bot size={56} color="white" />
            </View>
            <Text className="text-white font-bold text-3xl mb-1">Asistente IA</Text>
            <Text className="text-blue-100 text-center text-base px-4">
              Pregunta sobre cualquier emergencia y recibe ayuda paso a paso.
            </Text>
          </View>
        </TouchableOpacity>
      ),
    },
  ];

  const renderCarouselItem = ({ item }: { item: CarouselItem }) => {
    return (
      <View
        style={{
          width: CARD_WIDTH,
          height: 360, // Más alto
          paddingHorizontal: 6,
        }}
      >
        {item.renderContent()}
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const emergencyCategories = [
    { id: "cpr", title: "RCP", icon: Heart, color: "#EF4444", bgColor: "#FEE2E2" },
    { id: "bleeding", title: "Hemorragias", icon: Droplet, color: "#DC2626", bgColor: "#FEE2E2" },
    { id: "burns", title: "Quemaduras", icon: Flame, color: "#F97316", bgColor: "#FFEDD5" },
    { id: "fractures", title: "Fracturas", icon: Shield, color: "#3B82F6", bgColor: "#DBEAFE" },
    { id: "choking", title: "Ahogamiento", icon: Activity, color: "#EF4444", bgColor: "#FEE2E2" },
    { id: "seizures", title: "Convulsiones", icon: Zap, color: "#F59E0B", bgColor: "#FEF3C7" },
  ];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* HEADER */}
        <View className="bg-[#002e90] pt-14 pb-10 px-6 rounded-b-[36px] shadow-md mb-8">
          <View className="items-center">
            <Image
              source={LifeAidLogo}
              resizeMode="contain"
              style={{ width: 200, height: 30 }}
            />
          </View>
        </View>

        {/* CARRUSEL */}
        <View className="mb-10">
          <View className="px-6 flex-row items-center mb-5">
            <View className="bg-red-100 p-2 rounded-xl mr-3">
              <Phone size={22} color="#EF4444" />
            </View>
            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Acciones Rápidas
            </Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={CARD_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: SPACING_FOR_CARD_INSET - 6,
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />

          {/* Indicadores */}
          <View className="flex-row justify-center mt-4 space-x-3">
            {slides.map((slide, index) => (
              <View
                key={slide.id}
                className={`h-2 rounded-full ${index === currentIndex ? "bg-[#002e90] w-8" : "bg-slate-300 w-2"
                  }`}
              />
            ))}
          </View>
        </View>

        {/* GUÍAS */}
        <View className="mb-10 px-6">
          <View className="flex-row items-center mb-5">
            <View className="bg-blue-100 p-2 rounded-xl mr-3">
              <Shield size={22} color="#002e90" />
            </View>
            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Guías
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {emergencyCategories.map((category) => {
              const Icon = category.icon;
              return (
                <View key={category.id} style={{ width: "48%", marginBottom: 16 }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation?.navigate("GuideDetail", { guideId: category.id })}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 items-center justify-center h-32"
                  >
                    <View className="p-3 rounded-full mb-2" style={{ backgroundColor: category.bgColor }}>
                      <Icon size={28} color={category.color} />
                    </View>
                    <Text className="font-semibold text-slate-700 dark:text-slate-200 text-center">
                      {category.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* PREPARACIÓN */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center mb-5">
            <View className="bg-emerald-100 p-2 rounded-xl mr-3">
              <PackageCheck size={22} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Preparación
            </Text>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation?.navigate("Kit")}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sl border border-slate-200 dark:border-slate-700 p-4 flex-row items-center mb-4"
            >
              <View className="bg-emerald-50 p-3 rounded-2xl mr-4">
                <Shield size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  Kit de Emergencia
                </Text>
                <Text className="text-slate-500 text-sm">Elementos esenciales</Text>
              </View>
              <Text className="text-slate-300 text-2xl font-light">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation?.navigate("Checklist")}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sl border border-slate-200 dark:border-slate-700 p-4 flex-row items-center"
            >
              <View className="bg-blue-50 p-3 rounded-2xl mr-4">
                <PackageCheck size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  Checklist
                </Text>
                <Text className="text-slate-500 text-sm">Tu progreso de preparación</Text>
              </View>
              <Text className="text-slate-300 text-2xl font-light">›</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sl border border-slate-200 dark:border-slate-700 p-4 flex-row items-center justify-between mt-4">
            <View className="flex-row items-center">
              <View className="bg-blue-50 p-3 rounded-2xl mr-4">
                <Shield size={24} color="#3B82F6" />
              </View>
              <View>
                <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  Monitoreo de Accidentes
                </Text>
                <Text className="text-slate-500 text-sm">Detectar accidentes en segundo plano</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isMonitoring ? "#3B82F6" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleMonitoring}
              value={isMonitoring}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default HomeScreen;

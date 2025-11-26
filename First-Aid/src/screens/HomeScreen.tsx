// src/screens/HomeScreen.tsx
import ContactManager from "@/components/ContactManager";
import SosButtonNative from "@/components/SosButtonNative";
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
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LifeAidLogo = require("@/assets/lifeaid.png");
const screenWidth = Dimensions.get("window").width;
const CAROUSEL_ITEM_WIDTH = screenWidth - 60;

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
  const flatListRef = useRef<FlatList>(null);

  const slides: CarouselItem[] = [
    {
      id: "sos",
      title: "Botón de Emergencia",
      renderContent: () => (
        <View className="bg-white rounded-3xl shadow-lg p-6 items-center justify-center" style={{ height: 280 }}>
          <Text className="text-xl font-bold text-slate-800 mb-4">Botón de Emergencia</Text>
          <SosButtonNative contacts={emergencyContacts} />
        </View>
      ),
    },
    {
      id: "contacts",
      title: "Contactos",
      renderContent: () => (
        <View className="bg-white rounded-3xl shadow-lg p-4" style={{ height: 280 }}>
          <ContactManager onContactsChange={setEmergencyContacts} />
        </View>
      ),
    },
    {
      id: "ai",
      title: "Asistente IA",
      renderContent: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation?.navigate("ChatIA")}
          className="bg-blue-600 rounded-3xl shadow-lg overflow-hidden"
          style={{ height: 280 }}
        >
          <View className="flex-1 items-center justify-center p-6">
            <View className="bg-blue-500 p-6 rounded-3xl mb-4">
              <Bot size={48} color="white" />
            </View>
            <Text className="text-white font-bold text-2xl mb-2">Asistente IA</Text>
            <Text className="text-blue-100 text-center text-base font-medium">
              Pregunta sobre tu emergencia y obtén ayuda inmediata
            </Text>
          </View>
        </TouchableOpacity>
      ),
    },
  ];

  const renderCarouselItem = ({ item, index }: { item: CarouselItem; index: number }) => {
    return (
      <View 
        style={{ 
          width: CAROUSEL_ITEM_WIDTH,
          marginHorizontal: 5,
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
    {
      id: "cpr",
      title: "RCP",
      icon: Heart,
      color: "#EF4444",
      bgColor: "#FEE2E2",
    },
    {
      id: "bleeding",
      title: "Hemorragias",
      icon: Droplet,
      color: "#DC2626",
      bgColor: "#FEE2E2",
    },
    {
      id: "burns",
      title: "Quemaduras",
      icon: Flame,
      color: "#F97316",
      bgColor: "#FFEDD5",
    },
    {
      id: "fractures",
      title: "Fracturas",
      icon: Shield,
      color: "#3B82F6",
      bgColor: "#DBEAFE",
    },
    {
      id: "choking",
      title: "Ahogamiento",
      icon: Activity,
      color: "#EF4444",
      bgColor: "#FEE2E2",
    },
    {
      id: "seizures",
      title: "Convulsiones",
      icon: Zap,
      color: "#F59E0B",
      bgColor: "#FEF3C7",
    },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header con Logo - REDUCIDO */}
        <View className="bg-blue-600 pt-8 pb-6 px-6 rounded-b-[32px] shadow-sm mb-6">
          <View className="items-center mb-3">
            <Image
              source={LifeAidLogo}
              resizeMode="contain"
              style={{ width: 120, height: 120 }}
            />
          </View>
          <Text className="text-white text-center text-xl font-bold mb-1">
            FirstAId
          </Text>
          <Text className="text-blue-100 text-center text-xs font-medium">
            Tu asistente de primeros auxilios
          </Text>
        </View>

        <View className="px-5">
          {/* Carousel con SOS, Contacts y AI */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="bg-red-50 p-2 rounded-xl mr-3">
                <Phone size={20} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-slate-800">
                Acciones Rápidas
              </Text>
            </View>
            
            <View>
              <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderCarouselItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CAROUSEL_ITEM_WIDTH + 10}
                decelerationRate="fast"
                contentContainerStyle={{
                  paddingHorizontal: (screenWidth - CAROUSEL_ITEM_WIDTH) / 2,
                }}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 50,
                }}
              />
              
              {/* Indicadores de página */}
              <View className="flex-row justify-center mt-4" style={{ gap: 8 }}>
                {slides.map((slide, index) => (
                  <View
                    key={slide.id}
                    className={`h-2 rounded-full ${
                      index === currentIndex ? "bg-blue-600 w-8" : "bg-slate-300 w-2"
                    }`}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Guías de Primeros Auxilios */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-50 p-2 rounded-xl mr-3">
                <Shield size={20} color="#2563EB" />
              </View>
              <Text className="text-xl font-bold text-slate-800">
                Guías de Emergencia
              </Text>
            </View>

            <View className="flex-row flex-wrap -mx-2">
              {emergencyCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <View key={category.id} className="w-1/2 px-2 mb-4">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation?.navigate("GuideDetail", {
                          guideId: category.id,
                        })
                      }
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                      style={{ elevation: 2 }}
                    >
                      <View className="p-5 items-center">
                        <View
                          className="p-4 rounded-2xl mb-3"
                          style={{ backgroundColor: category.bgColor }}
                        >
                          <Icon size={32} color={category.color} />
                        </View>
                        <Text className="font-bold text-sm text-slate-800 text-center">
                          {category.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Preparación */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="bg-green-50 p-2 rounded-xl mr-3">
                <PackageCheck size={20} color="#10B981" />
              </View>
              <Text className="text-xl font-bold text-slate-800">
                Preparación
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              {/* Kit de Emergencia */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation?.navigate("Kit")}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                style={{ elevation: 2 }}
              >
                <View className="flex-row items-center p-4">
                  <View className="bg-green-50 p-3 rounded-2xl mr-4">
                    <Shield size={24} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-slate-800 text-base mb-1">
                      Kit de Emergencia
                    </Text>
                    <Text className="text-slate-500 text-sm">
                      Ver contenido recomendado
                    </Text>
                  </View>
                  <Text className="text-slate-400 text-xl">›</Text>
                </View>
              </TouchableOpacity>

              {/* Checklist */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation?.navigate("Checklist")}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                style={{ elevation: 2 }}
              >
                <View className="flex-row items-center p-4">
                  <View className="bg-blue-50 p-3 rounded-2xl mr-4">
                    <PackageCheck size={24} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-slate-800 text-base mb-1">
                      Checklist de Preparación
                    </Text>
                    <Text className="text-slate-500 text-sm">
                      Marca lo que ya tienes listo
                    </Text>
                  </View>
                  <Text className="text-slate-400 text-xl">›</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

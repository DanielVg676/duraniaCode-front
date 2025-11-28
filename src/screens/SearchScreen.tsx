// src/screens/SearchScreen.tsx
import { guides } from '@/data/guides'; // <--- IMPORTACIÓN CLAVE
import {
  Activity,
  AlertTriangle,
  Bug,
  ChevronRight,
  Droplet,
  Flame,
  Heart,
  Search,
  Shield,
  Thermometer,
  X,
  Eye,       // Nuevo icono
  Skull,     // Nuevo icono
  Zap        // Nuevo icono
} from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface SearchScreenProps {
  navigation: any; 
}

// Mapa para vincular IDs de datos con Iconos Visuales
const ICON_MAP: Record<string, any> = {
  cpr: Heart,
  heart_attack: Heart,
  stroke: Activity,
  bleeding: Droplet,
  burns: Flame,
  fractures: Shield,
  choking: Activity,
  seizures: Zap,
  asthma: Activity,
  diabetes_low: Activity,
  poisoning: Skull,
  'insect-bites': Bug,
  snake_bite: Bug,
  head_injury: Shield,
  eye_injury: Eye,
  hypothermia: Thermometer,
  shock: AlertTriangle,
  fainting: AlertTriangle,
  heatstroke: Flame,
};

const normalizeText = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const SearchScreen = ({ navigation }: SearchScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // CONVERTIR EL OBJETO DE DATOS EN ARRAY PARA LA LISTA
  // Usamos useMemo para que no se recalcule en cada render
  const allGuides = useMemo(() => {
    return Object.entries(guides).map(([id, data]) => ({
      id,
      ...data,
      icon: ICON_MAP[id] || Activity // Icono por defecto si falta alguno
    }));
  }, []);

  const suggestedSearches = [
    'Desmayo', 'Sangrado', 'Quemadura', 'Fractura', 
    'Convulsión', 'Ahogo', 'Alergia', 'RCP'
  ];

  const filteredGuides = useMemo(() => {
    if (!searchTerm) return [];

    const normalizedSearch = normalizeText(searchTerm);
    const searchTokens = normalizedSearch.split(' ').filter(token => token.length > 0);

    return allGuides.filter(guide => {
      // Ahora usamos los datos reales importados
      const guideContent = normalizeText(
        `${guide.title} ${guide.description} ${guide.tags.join(' ')} ${guide.keywords || ''}`
      );
      return searchTokens.every(token => guideContent.includes(token));
    });
  }, [searchTerm, allGuides]);

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'critical': 
        return { color: '#EF4444', bg: 'bg-red-50', border: 'border-red-100', label: 'CRÍTICO' };
      case 'high': 
        return { color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-100', label: 'ALTO' };
      case 'medium': 
        return { color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-100', label: 'MEDIO' };
      default: 
        return { color: '#64748B', bg: 'bg-slate-50', border: 'border-slate-100', label: 'BAJO' };
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style="light" />
      
      {/* HEADER DE BÚSQUEDA */}
      <View className="bg-[#002e90] pt-12 pb-6 px-6 rounded-b-[32px] shadow-lg z-10">
        <Text className="text-2xl font-bold text-white mb-4">Buscar Guía</Text>
        
        <View className="flex-row items-center bg-white rounded-2xl px-4 h-14 shadow-sm">
          <Search size={20} color="#94a3b8" />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Síntoma, lesión o palabra clave..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-3 text-slate-800 font-medium text-base h-full"
            selectionColor="#002e90"
            autoCapitalize="none"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')} className="p-2">
              <View className="bg-slate-100 rounded-full p-1">
                <X size={14} color="#64748B" />
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        {searchTerm.length > 0 && (
            <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-blue-200 text-xs font-medium ml-1">
                    {filteredGuides.length} resultados encontrados
                </Text>
            </View>
        )}
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-6" 
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {searchTerm === '' ? (
          <View>
            <Text className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-base ml-1">
              Búsquedas frecuentes
            </Text>
            
            <View className="flex-row flex-wrap gap-2 mb-10">
              {suggestedSearches.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  onPress={() => setSearchTerm(suggestion)}
                  className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm active:bg-slate-50"
                >
                  <Text className="text-slate-600 dark:text-slate-300 font-medium">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="items-center py-8 border-t border-slate-200 dark:border-slate-800">
              <View className="bg-blue-50 dark:bg-slate-800 p-5 rounded-full mb-4">
                <Search size={36} color="#002e90" />
              </View>
              <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">
                ¿Qué emergencia tienes?
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-center px-6 leading-6">
                Encuentra guías paso a paso para actuar rápidamente ante cualquier situación.
              </Text>
            </View>
          </View>
        ) : (
          <View className="space-y-3">
            {filteredGuides.length === 0 ? (
              <View className="items-center py-12 opacity-80">
                <AlertTriangle size={56} color="#94a3b8" style={{ marginBottom: 16 }} />
                <Text className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2 text-center">
                  Sin resultados
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-[250px]">
                  No encontramos una guía exacta. Intenta usar sinónimos o pregúntale a la IA.
                </Text>
                
                <TouchableOpacity
                    onPress={() => navigation.navigate('ChatIA')}
                    className="bg-[#002e90] px-8 py-4 rounded-2xl shadow-lg shadow-blue-900/20 flex-row items-center"
                >
                    <Text className="text-white font-bold text-lg mr-2">Preguntar a la IA</Text>
                    <ChevronRight size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              filteredGuides.map((guide) => {
                const Icon = guide.icon;
                const config = getUrgencyConfig(guide.urgency);
                
                return (
                  <TouchableOpacity 
                    key={guide.id}
                    onPress={() => navigation.navigate('GuideDetail', { guideId: guide.id })}
                    activeOpacity={0.7}
                    className={`mb-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border ${config.border} dark:border-slate-700 overflow-hidden`}
                  >
                    <View className="p-4 flex-row gap-4">
                      <View className={`h-14 w-14 rounded-2xl items-center justify-center ${config.bg} dark:bg-slate-700`}>
                        <Icon size={28} color={config.color} />
                      </View>
                      
                      <View className="flex-1 justify-center">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="font-bold text-slate-800 dark:text-slate-100 text-lg flex-1 mr-2">
                            {guide.title}
                          </Text>
                          <View className={`px-2 py-1 rounded bg-white/50 dark:bg-slate-600 border ${config.border} dark:border-slate-500`}>
                            <Text className={`text-[10px] font-bold`} style={{ color: config.color }}>
                                {config.label}
                            </Text>
                          </View>
                        </View>
                        
                        <Text className="text-slate-500 dark:text-slate-400 text-sm leading-5 mb-2" numberOfLines={2}>
                          {guide.description}
                        </Text>

                        <View className="flex-row flex-wrap gap-1">
                            {guide.tags.map(tag => (
                                <Text key={tag} className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                                    #{tag}
                                </Text>
                            ))}
                        </View>
                      </View>
                      
                      <View className="justify-center">
                        <ChevronRight size={20} color="#cbd5e1" />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
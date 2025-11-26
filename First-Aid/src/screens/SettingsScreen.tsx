import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch'; // Asegúrate de que este archivo tenga el código que corregimos antes
import { useTheme } from '@/contexts/ThemeContext';
import {
  Download,
  Globe,
  Heart,
  Info,
  MapPin,
  Moon,
  Phone,
  Settings as SettingsIcon,
  Shield,
  Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';

const SettingsScreen = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [offlineMode, setOfflineMode] = useState(true);
  const [location, setLocation] = useState(true);

  const settingsOptions = [
    {
      title: 'Idioma',
      description: 'Español (por defecto)',
      icon: Globe,
      action: 'select',
      value: 'es'
    },
    {
      title: 'Modo Oscuro',
      description: 'Cambiar tema de la aplicación',
      icon: Moon,
      action: 'toggle',
      value: isDarkMode,
      onChange: () => toggleDarkMode()
    },
    {
      title: 'Modo Offline',
      description: 'Funciona sin conexión a internet',
      icon: Download,
      action: 'toggle',
      value: offlineMode,
      onChange: setOfflineMode,
      disabled: true // Ejemplo de switch deshabilitado
    },
    {
      title: 'Ubicación de Emergencia',
      description: 'Permitir acceso para emergencias',
      icon: MapPin,
      action: 'toggle',
      value: location,
      onChange: setLocation
    }
  ];

  const emergencyContacts = [
    {
      name: 'Servicios de Emergencia',
      number: '911',
      type: 'Emergencias Generales'
    },
    {
      name: 'Cruz Roja',
      number: '065',
      type: 'Primeros Auxilios'
    },
    {
      name: 'Bomberos',
      number: '080',
      type: 'Incendios y Rescate'
    }
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-slate-900" 
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Moderno con Gradiente Visual */}
      <View className="bg-blue-600 dark:bg-slate-800 pt-12 pb-10 px-6 rounded-b-[32px] shadow-sm mb-6">
        <View className="items-center">
          <View className="bg-blue-500/30 dark:bg-slate-700/50 p-4 rounded-2xl mb-3 border border-blue-400/20 dark:border-slate-600/20">
            <SettingsIcon size={32} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white mb-1">Configuración</Text>
          <Text className="text-blue-100 dark:text-slate-300 text-sm text-center font-medium">
            Personaliza tu experiencia FirstAId
          </Text>
        </View>
      </View>

      <View className="px-5">
        
        {/* General Settings */}
        <Card className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
          <CardHeader className="pb-2 pt-5 px-5">
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl">
                <SettingsIcon size={20} color="#2563EB" />
              </View>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">General</CardTitle>
            </View>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-2">
            <View style={{ gap: 16 }}>
            {settingsOptions.map((option) => {
              const Icon = option.icon;
              return (
                <View 
                  key={option.title} 
                  className="flex-row items-center justify-between py-4 px-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600"
                >
                  <View className="flex-row items-center gap-3 flex-1 mr-2">
                    <View className="bg-white dark:bg-slate-600 p-2 rounded-xl shadow-sm">
                      <Icon size={18} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-slate-800 dark:text-slate-100 text-[15px]">{option.title}</Text>
                      <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight" numberOfLines={1}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Switch Placement Fix: Direct usage inside justify-between container */}
                  {option.action === 'toggle' && (
                    <Switch
                      checked={option.value as boolean}
                      onCheckedChange={option.onChange}
                      disabled={option.disabled}
                    />
                  )}
                  
                  {option.action === 'select' && (
                    <Badge className="bg-blue-100 border-0 text-blue-700 font-bold px-2.5">
                      ES
                    </Badge>
                  )}
                </View>
              );
            })}
            </View>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
          <CardHeader className="pb-2 pt-5 px-5">
            <View className="flex-row items-center gap-3">
              <View className="bg-red-50 dark:bg-red-900/30 p-2.5 rounded-xl">
                <Phone size={20} color="#EF4444" />
              </View>
              <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">Contactos SOS</Text>
            </View>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-2">
            <View style={{ gap: 16 }}>
            {emergencyContacts.map((contact) => (
              <View 
                key={contact.number} 
                className="flex-row items-center justify-between p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
              >
                <View className="flex-1 mr-2">
                  <Text className="font-bold text-slate-800 dark:text-slate-100">{contact.name}</Text>
                  <Text className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{contact.type}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="bg-white px-3 py-1.5 rounded-full border border-red-100">
                    <Text className="text-red-600 font-bold text-sm">{contact.number}</Text>
                  </View>
                  <Button 
                    size="sm" 
                    className="bg-red-500 h-9 w-9 rounded-full p-0 flex items-center justify-center shadow-red-200 shadow-md"
                    onPress={() => Linking.openURL(`tel:${contact.number}`)}
                  >
                    <Phone size={14} color="white" />
                  </Button>
                </View>
              </View>
            ))}
            </View>
          </CardContent>
        </Card>

        {/* App Info - CORREGIDO: Espaciado aumentado (space-y-3) */}
        <Card className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
          <CardHeader className="pb-2 pt-5 px-5">
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl">
                <Info size={20} color="#3B82F6" />
              </View>
              <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">Información</Text>
            </View>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-2">
            <View style={{ gap: 16 }}> {/* Espaciado entre elementos */}
              
              <View className="flex-row justify-between items-center py-4 px-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                <Text className="text-sm font-semibold text-slate-600 dark:text-slate-300">Versión</Text>
                <Badge className="bg-blue-100 text-blue-700 border-0">1.0.0</Badge>
              </View>
              
              <View className="flex-row justify-between items-center py-4 px-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                <Text className="text-sm font-semibold text-slate-600 dark:text-slate-300">Modo</Text>
                <Badge className="bg-emerald-100 text-emerald-700 border-0">Offline</Badge>
              </View>
              
              <View className="flex-row justify-between items-center py-4 px-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                <Text className="text-sm font-semibold text-slate-600 dark:text-slate-300">Guías</Text>
                <Badge className="bg-blue-100 text-blue-700 border-0">10 Disponibles</Badge>
              </View>
              
              <View className="flex-row justify-between items-center py-4 px-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                <Text className="text-sm font-semibold text-slate-600 dark:text-slate-300">Actualizado</Text>
                <Text className="text-xs font-bold text-slate-400 dark:text-slate-500">20 AGO 2025</Text>
              </View>

            </View>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="bg-blue-50/50 dark:bg-slate-800/50 rounded-3xl border border-blue-100 dark:border-slate-700 overflow-hidden mb-8">
           <View className="absolute top-0 right-0 p-4 opacity-10">
              <Heart size={100} color="#3B82F6" />
           </View>
          <CardHeader className="pb-2 pt-5 px-5">
            <View className="flex-row items-center gap-3">
              <View className="bg-white dark:bg-slate-700 p-2.5 rounded-xl shadow-sm">
                <Heart size={20} color="#EF4444" />
              </View>
              <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">Sobre FirstAId</Text>
            </View>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-2">
            <Text className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              FirstAId es tu compañero confiable para emergencias médicas offline.
            </Text>
            
            <View style={{ gap: 12 }}>
              <View className="bg-white/80 dark:bg-slate-700/50 p-4 rounded-xl flex-row items-center gap-3 border border-blue-100/50 dark:border-slate-600">
                <Users size={16} color="#3B82F6" />
                <Text className="text-xs text-slate-700 dark:text-slate-300 font-medium">Equipo FirstAId</Text>
              </View>
              <View className="bg-white/80 dark:bg-slate-700/50 p-4 rounded-xl flex-row items-center gap-3 border border-blue-100/50 dark:border-slate-600">
                <Shield size={16} color="#10B981" />
                <Text className="text-xs text-slate-700 dark:text-slate-300 font-medium">Validado por médicos</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons - CORREGIDO: Espaciado aumentado (gap: 20) */}
        <View style={{ gap: 20 }} className="pt-2 pb-8">
          <Button className="w-full bg-blue-600 h-14 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">
            <View className="flex-row items-center justify-center gap-3">
              <Download size={20} color="white" />
              <Text className="text-white font-bold text-base">Descargar Guías Adicionales</Text>
            </View>
          </Button>
          
          <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-200 bg-white active:bg-slate-50">
            <View className="flex-row items-center justify-center gap-3">
              <Info size={20} color="#64748B" />
              <Text className="text-slate-600 font-bold text-base">Tutorial de la App</Text>
            </View>
          </Button>
        </View>

      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
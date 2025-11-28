import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Bell,
  ChevronRight,
  Download,
  Globe,
  Heart,
  Info,
  MapPin,
  Moon,
  Phone,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  Users
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  isMonitoringActive,
  startCrashMonitoring,
  stopCrashMonitoring,
} from '../native/crash';

const SettingsScreen = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  // Estados para los switches
  const [offlineMode, setOfflineMode] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const active = await isMonitoringActive();
        setIsMonitoring(active);
      } catch (error) {
        console.error("Error checking monitoring status:", error);
      }
    };
    checkStatus();
  }, []);

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
      setIsMonitoring(!isActive);
    }
  };

  // Configuración de secciones
  const generalSettings = [
    {
      id: 'lang',
      title: 'Idioma',
      description: 'Español (Latinoamérica)',
      icon: Globe,
      type: 'value',
      value: 'ES'
    },
    {
      id: 'dark_mode',
      title: 'Modo Oscuro',
      description: 'Interfaz con colores oscuros',
      icon: Moon,
      type: 'toggle',
      value: isDarkMode,
      onToggle: () => toggleDarkMode()
    },
    {
      id: 'offline',
      title: 'Modo Offline',
      description: 'Descargar guías automáticamente',
      icon: Download,
      type: 'toggle',
      value: offlineMode,
      onToggle: () => setOfflineMode(!offlineMode)
    },
    {
      id: 'crash_monitoring',
      title: 'Monitoreo de Accidentes',
      description: 'Detectar accidentes en segundo plano',
      icon: Shield,
      type: 'toggle',
      value: isMonitoring,
      onToggle: () => toggleMonitoring(!isMonitoring)
    },
  ];

  const privacySettings = [
    {
      id: 'location',
      title: 'Ubicación SOS',
      description: 'Compartir ubicación al llamar al 911',
      icon: MapPin,
      type: 'toggle',
      value: locationEnabled,
      onToggle: () => setLocationEnabled(!locationEnabled)
    },
    {
      id: 'notifications',
      title: 'Alertas',
      description: 'Recibir notificaciones de seguridad',
      icon: Bell,
      type: 'toggle',
      value: notificationsEnabled,
      onToggle: () => setNotificationsEnabled(!notificationsEnabled)
    }
  ];

  const emergencyContacts = [
    { name: 'Emergencias', number: '911', type: 'General', color: 'bg-red-500' },
    { name: 'Cruz Roja', number: '065', type: 'Médica', color: 'bg-white border border-red-200' },
    { name: 'Bomberos', number: '080', type: 'Rescate', color: 'bg-white border border-red-200' }
  ];

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
    {/* <StatusBar style="light" /> */}
      
      {/* HEADER DE MARCA (#002e90) */}
      <View className="bg-[#002e90] pt-14 pb-8 px-6 rounded-b-[32px] shadow-lg z-10 mb-6">
        <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-4">
                <View className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <SettingsIcon size={28} color="white" />
                </View>
                <View>
                    <Text className="text-2xl font-bold text-white">Ajustes</Text>
                    <Text className="text-blue-200 text-sm font-medium">Perfil y Preferencias</Text>
                </View>
            </View>
            
            {/* Avatar de usuario simulado */}
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border-2 border-white/10">
                <Text className="text-white font-bold text-lg">CV</Text>
            </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5" 
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* SECCIÓN: NÚMEROS DE EMERGENCIA */}
        <View className="mb-8">
            <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-2">
                Directorios SOS
            </Text>
            <View className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <View style={{ gap: 12 }}>
                    {emergencyContacts.map((contact, index) => {
                        const isPrimary = contact.number === '911';
                        return (
                            <TouchableOpacity 
                                key={contact.number}
                                onPress={() => handleCall(contact.number)}
                                className={`flex-row items-center justify-between p-3 rounded-2xl ${isPrimary ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-700/30'}`}
                            >
                                <View className="flex-row items-center gap-3">
                                    <View className={`w-10 h-10 rounded-full items-center justify-center ${contact.color}`}>
                                        <Phone size={18} color={isPrimary ? 'white' : '#ef4444'} />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-slate-800 dark:text-slate-100">{contact.name}</Text>
                                        <Text className="text-xs text-slate-500 dark:text-slate-400">{contact.type}</Text>
                                    </View>
                                </View>
                                <View className="bg-white dark:bg-slate-600 px-3 py-1 rounded-lg">
                                    <Text className="font-bold text-slate-700 dark:text-slate-200">{contact.number}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>

        {/* SECCIÓN: GENERAL */}
        <View className="mb-8">
            <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-2">
                General
            </Text>
            <View className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                {generalSettings.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <View key={item.id}>
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-center gap-4 flex-1">
                                    <View className="bg-blue-50 dark:bg-blue-900/30 w-10 h-10 rounded-xl items-center justify-center">
                                        <Icon size={20} color="#002e90" />
                                    </View>
                                    <View className="flex-1 mr-2">
                                        <Text className="font-semibold text-slate-800 dark:text-slate-100 text-base">
                                            {item.title}
                                        </Text>
                                        <Text className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>

                                {item.type === 'toggle' ? (
                                    <Switch 
                                        checked={item.value as boolean}
                                        onCheckedChange={item.onToggle}
                                    />
                                ) : (
                                    <View className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg flex-row items-center">
                                        <Text className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-1">{item.value}</Text>
                                        <ChevronRight size={14} color="#94a3b8" />
                                    </View>
                                )}
                            </View>
                            {/* Separador excepto en el último */}
                            {index < generalSettings.length - 1 && (
                                <View className="h-[1px] bg-slate-100 dark:bg-slate-700 mx-16" />
                            )}
                        </View>
                    );
                })}
            </View>
        </View>

        {/* SECCIÓN: PRIVACIDAD Y SEGURIDAD */}
        <View className="mb-8">
            <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-2">
                Seguridad
            </Text>
            <View className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                {privacySettings.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <View key={item.id}>
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-center gap-4 flex-1">
                                    <View className="bg-orange-50 dark:bg-orange-900/20 w-10 h-10 rounded-xl items-center justify-center">
                                        <Icon size={20} color="#f97316" />
                                    </View>
                                    <View className="flex-1 mr-2">
                                        <Text className="font-semibold text-slate-800 dark:text-slate-100 text-base">
                                            {item.title}
                                        </Text>
                                        <Text className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                                <Switch 
                                    checked={item.value as boolean}
                                    onCheckedChange={item.onToggle}
                                />
                            </View>
                            {index < privacySettings.length - 1 && (
                                <View className="h-[1px] bg-slate-100 dark:bg-slate-700 mx-16" />
                            )}
                        </View>
                    );
                })}
            </View>
        </View>

        {/* INFO APP */}
        <View className="mb-8 bg-blue-50 dark:bg-slate-800/50 rounded-3xl p-6 items-center border border-blue-100 dark:border-slate-700">
            <View className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl items-center justify-center shadow-sm mb-3">
                <Heart size={32} color="#002e90" fill="#002e90" />
            </View>
            <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">FirstAId App</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs mb-4">Versión 1.0.0 (Build 2025)</Text>
            
            <View className="flex-row gap-3 w-full">
                <TouchableOpacity className="flex-1 bg-white dark:bg-slate-700 py-3 rounded-xl border border-slate-200 dark:border-slate-600 items-center">
                    <Text className="text-xs font-bold text-slate-700 dark:text-slate-200">Términos</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white dark:bg-slate-700 py-3 rounded-xl border border-slate-200 dark:border-slate-600 items-center">
                    <Text className="text-xs font-bold text-slate-700 dark:text-slate-200">Privacidad</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* BOTÓN FINAL */}
        <Button 
            className="w-full bg-[#002e90] h-14 rounded-2xl shadow-lg shadow-blue-900/20 mb-6"
        >
            <View className="flex-row items-center justify-center gap-2">
                <Smartphone size={20} color="white" />
                <Text className="text-white font-bold text-base">Contactar Soporte</Text>
            </View>
        </Button>

      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
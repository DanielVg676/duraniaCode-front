import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
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
  const [darkMode, setDarkMode] = useState(false);
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
      value: darkMode,
      onChange: setDarkMode
    },
    {
      title: 'Modo Offline',
      description: 'Funciona sin conexión a internet',
      icon: Download,
      action: 'toggle',
      value: offlineMode,
      onChange: setOfflineMode,
      disabled: true
    },
    {
      title: 'Ubicación de Emergencia',
      description: 'Permitir acceso a ubicación para emergencias',
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
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header Moderno con Gradiente Visual */}
      <View className="bg-blue-600 pt-12 pb-8 px-6">
        <View className="items-center">
          <View className="bg-blue-500 p-4 rounded-2xl shadow-lg mb-3">
            <SettingsIcon size={32} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white mb-1">Configuración</Text>
          <Text className="text-blue-100 text-sm text-center">Personaliza tu experiencia FirstAId</Text>
        </View>
      </View>

      <View className="px-4 -mt-4 space-y-4 pb-6">
        {/* General Settings */}
        <Card className="mb-4 bg-white rounded-2xl shadow-md border-0">
          <CardHeader className="pb-3">
            <View className="flex-row items-center gap-2">
              <View className="bg-blue-50 p-2 rounded-lg">
                <SettingsIcon size={18} color="#2563EB" />
              </View>
              <CardTitle className="text-lg text-slate-800">Configuración General</CardTitle>
            </View>
          </CardHeader>
          <CardContent className="space-y-1">
            {settingsOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <View 
                  key={option.title} 
                  className={cn(
                    "flex-row items-center justify-between py-3.5 px-3 rounded-xl",
                    index !== settingsOptions.length - 1 && "mb-1"
                  )}
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="bg-white p-2 rounded-lg shadow-sm">
                      <Icon size={20} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-slate-800">{option.title}</Text>
                      <Text className="text-xs text-slate-500 mt-0.5">{option.description}</Text>
                    </View>
                  </View>
                  
                  {option.action === 'toggle' && (
                    <Switch
                      checked={option.value as boolean}
                      onCheckedChange={option.onChange}
                      disabled={option.disabled}
                      className="ml-2"
                    />
                  )}
                  
                  {option.action === 'select' && (
                    <Badge className="bg-blue-100 border-0 text-blue-700">
                      ES
                    </Badge>
                  )}
                </View>
              );
            })}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mb-4 bg-white rounded-2xl shadow-md border-0">
          <CardHeader className="pb-3">
            <View className="flex-row items-center gap-2">
              <View className="bg-red-50 p-2 rounded-lg">
                <Phone size={20} color="#EF4444" />
              </View>
              <Text className="text-lg font-bold text-slate-800">Contactos de Emergencia</Text>
            </View>
          </CardHeader>
          <CardContent className="space-y-2">
            {emergencyContacts.map((contact, index) => (
              <View 
                key={contact.number} 
                className={cn(
                  "flex-row items-center justify-between p-3 rounded-xl",
                  index !== emergencyContacts.length - 1 && "mb-1"
                )}
                style={{ backgroundColor: '#FEF2F2' }}
              >
                <View className="flex-1">
                  <Text className="font-bold text-slate-800">{contact.name}</Text>
                  <Text className="text-xs text-slate-600 mt-0.5">{contact.type}</Text>
                </View>
                <View className="items-end gap-2">
                  <View className="bg-red-600 px-3 py-1.5 rounded-full shadow-sm">
                    <Text className="text-white font-bold text-sm">{contact.number}</Text>
                  </View>
                  <Button 
                    size="sm" 
                    className="bg-red-500 h-8 px-4 rounded-full"
                    onPress={() => Linking.openURL(`tel:${contact.number}`)}
                    textClassName="text-white text-xs font-semibold"
                  >
                    Llamar
                  </Button>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-4 bg-white rounded-2xl shadow-md border-0">
          <CardHeader className="pb-3">
            <View className="flex-row items-center gap-2">
              <View className="bg-blue-50 p-2 rounded-lg">
                <Info size={20} color="#3B82F6" />
              </View>
              <Text className="text-lg font-bold text-slate-800">Información de la App</Text>
            </View>
          </CardHeader>
          <CardContent>
            <View className="space-y-1">
              <View className="flex-row justify-between items-center py-3 px-3 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
                <Text className="text-sm font-semibold text-slate-700">Versión</Text>
                <View className="bg-blue-100 px-3 py-1 rounded-full">
                  <Text className="text-blue-700 font-bold text-xs">1.0.0</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center py-3 px-3 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
                <Text className="text-sm font-semibold text-slate-700">Modo</Text>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 font-bold text-xs">Offline</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center py-3 px-3 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
                <Text className="text-sm font-semibold text-slate-700">Guías disponibles</Text>
                <View className="bg-blue-100 px-3 py-1 rounded-full">
                  <Text className="text-blue-700 font-bold text-xs">10</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center py-3 px-3 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
                <Text className="text-sm font-semibold text-slate-700">Última actualización</Text>
                <Text className="text-sm font-semibold text-slate-600">20 Ago 2025</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="mb-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md border-0" style={{ backgroundColor: '#EFF6FF' }}>
          <CardHeader className="pb-3">
            <View className="flex-row items-center gap-2">
              <View className="bg-red-50 p-2 rounded-lg">
                <Heart size={20} color="#EF4444" />
              </View>
              <Text className="text-lg font-bold text-slate-800">Acerca de FirstAId</Text>
            </View>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <Text className="text-sm text-slate-600 leading-relaxed">
                FirstAId es tu compañero confiable para emergencias médicas. 
                Diseñado para funcionar sin conexión a internet, te proporciona 
                acceso inmediato a guías de primeros auxilios y un asistente IA.
              </Text>
              
              <View className="bg-white p-3 rounded-xl shadow-sm mb-2">
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="bg-blue-50 p-1.5 rounded-lg">
                    <Users size={16} color="#3B82F6" />
                  </View>
                  <Text className="text-sm text-slate-700 font-medium flex-1">Desarrollado por el equipo FirstAId</Text>
                </View>
              </View>
              
              <View className="bg-white p-3 rounded-xl shadow-sm">
                <View className="flex-row items-center gap-2">
                  <View className="bg-green-50 p-1.5 rounded-lg">
                    <Shield size={16} color="#10B981" />
                  </View>
                  <Text className="text-sm text-slate-700 font-medium flex-1">Contenido validado por profesionales médicos</Text>
                </View>
              </View>
              
              <View className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <Text className="text-xs text-slate-700 leading-relaxed">
                  <Text className="font-bold text-amber-800">⚠️ Aviso importante:</Text>
                  <Text className="text-slate-600"> Esta aplicación proporciona información 
                  de primeros auxilios básicos. En caso de emergencia grave, 
                  siempre llama a los servicios de emergencia profesionales.</Text>
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <View className="space-y-3 mb-6">
          <Button className="w-full bg-blue-600 h-12 rounded-2xl shadow-md">
            <View className="flex-row items-center justify-center gap-2">
              <Download size={18} color="white" />
              <Text className="text-white font-semibold">Descargar Guías Adicionales</Text>
            </View>
          </Button>
          
          <Button variant="outline" className="w-full h-12 rounded-2xl border-2 border-blue-200 bg-white">
            <View className="flex-row items-center justify-center gap-2">
              <Info size={18} color="#3B82F6" />
              <Text className="text-blue-600 font-semibold">Tutorial de la App</Text>
            </View>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
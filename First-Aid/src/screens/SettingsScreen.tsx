import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
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
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary p-6 items-center">
        <SettingsIcon size={32} color="white" style={{ marginBottom: 8 }} />
        <Text className="text-xl font-bold text-primary-foreground">Configuración</Text>
        <Text className="text-primary-foreground/80 text-sm text-center">Personaliza tu experiencia FirstAId</Text>
      </View>

      <View className="p-4 space-y-6">
        {/* General Settings */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Configuración General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settingsOptions.map((option) => {
              const Icon = option.icon;
              return (
                <View key={option.title} className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Icon size={20} color="#6b7280" />
                    <View className="flex-1">
                      <Text className="font-medium text-foreground">{option.title}</Text>
                      <Text className="text-sm text-muted-foreground">{option.description}</Text>
                    </View>
                  </View>
                  
                  {option.action === 'toggle' && (
                    <Switch
                      checked={option.value as boolean}
                      onCheckedChange={option.onChange}
                      disabled={option.disabled}
                    />
                  )}
                  
                  {option.action === 'select' && (
                    <Badge variant="outline">ES</Badge>
                  )}
                </View>
              );
            })}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Phone size={20} color="#3b82f6" />
              <Text className="text-lg font-semibold">Contactos de Emergencia</Text>
            </View>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact) => (
              <View key={contact.number} className="flex-row items-center justify-between py-2">
                <View className="flex-1">
                  <Text className="font-medium text-foreground">{contact.name}</Text>
                  <Text className="text-sm text-muted-foreground">{contact.type}</Text>
                </View>
                <View className="items-end">
                  <Badge className="bg-red-600 mb-2">
                    {contact.number}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onPress={() => Linking.openURL(`tel:${contact.number}`)}
                  >
                    <Text className="text-xs">Llamar</Text>
                  </Button>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Info size={20} color="#3b82f6" />
              <Text className="text-lg font-semibold">Información de la App</Text>
            </View>
          </CardHeader>
          <CardContent className="space-y-4">
            <View className="space-y-3">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-muted-foreground">Versión</Text>
                <Badge variant="outline">1.0.0</Badge>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-muted-foreground">Modo</Text>
                <Badge className="bg-green-600">Offline</Badge>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-muted-foreground">Guías disponibles</Text>
                <Badge variant="outline">10</Badge>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted-foreground">Última actualización</Text>
                <Text className="text-sm text-foreground">20 Ago 2025</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Heart size={20} color="#ef4444" />
              <Text className="text-lg font-semibold">Acerca de FirstAId</Text>
            </View>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <Text className="text-sm text-muted-foreground leading-relaxed">
                FirstAId es tu compañero confiable para emergencias médicas. 
                Diseñado para funcionar sin conexión a internet, te proporciona 
                acceso inmediato a guías de primeros auxilios y un asistente IA.
              </Text>
              
              <View className="flex-row items-center gap-2 mb-3">
                <Users size={16} color="#6b7280" />
                <Text className="text-sm text-muted-foreground flex-1">Desarrollado por el equipo FirstAId</Text>
              </View>
              
              <View className="flex-row items-center gap-2 mb-3">
                <Shield size={16} color="#6b7280" />
                <Text className="text-sm text-muted-foreground flex-1">Contenido validado por profesionales médicos</Text>
              </View>
              
              <View className="pt-4 border-t border-border">
                <Text className="text-xs text-muted-foreground leading-relaxed">
                  <Text className="font-bold">Aviso importante:</Text> Esta aplicación proporciona información 
                  de primeros auxilios básicos. En caso de emergencia grave, 
                  siempre llama a los servicios de emergencia profesionales.
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <View className="space-y-3 mb-6">
          <Button variant="outline" className="w-full flex-row items-center justify-center">
            <Download size={16} color="#3b82f6" />
            <Text className="ml-2">Descargar Guías Adicionales</Text>
          </Button>
          
          <Button variant="outline" className="w-full flex-row items-center justify-center">
            <Info size={16} color="#3b82f6" />
            <Text className="ml-2">Tutorial de la App</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SosButtonProps {
  contacts: string[]; // Recibe los contactos como propiedad
  style?: ViewStyle;  // Para poder mover el botón desde el padre
}

export default function SosButton({ contacts, style }: SosButtonProps) {
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleSOS = async () => {
    setLoading(true);
    try {
      // 1. Verificar SMS
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "SMS no disponible en este dispositivo");
        setLoading(false);
        return;
      }

      // 2. Permisos de Ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permiso denegado", "Se requiere ubicación para enviar ayuda.");
        setLoading(false);
        return;
      }

      // 3. Obtener Coordenadas
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const { latitude, longitude } = location.coords;
      
      // Link universal de Google Maps
      const mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      const message = `¡AYUDA SOS! Estoy en una emergencia. Ubicación: ${mapLink}`;

      // 4. Enviar SMS
      const { result } = await SMS.sendSMSAsync(
        contacts,
        message
      );

      if (result === 'sent') {
        Alert.alert("Alerta iniciada", "Te hemos redirigido a la app de mensajes.");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Fallo al intentar enviar la alerta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[stylesButton.container, style]}>
      {/* Base shadow layer */}
      <View style={stylesButton.shadowLayer} />
      
      <TouchableOpacity 
        style={[stylesButton.button, pressed && stylesButton.buttonPressed]} 
        onPress={handleSOS}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={loading}
        activeOpacity={0.9}
      >
        {/* Inner shadow for depth */}
        <View style={stylesButton.innerShadow} />
        
        {/* Content */}
        <View style={stylesButton.content}>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={stylesButton.text}>SOS</Text>
          )}
        </View>
        
        {/* Highlight layer */}
        <View style={stylesButton.highlight} />
      </TouchableOpacity>
    </View>
  );
}

const stylesButton = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowLayer: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#DC2626',
    top: 6,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  button: {
    backgroundColor: '#EF4444',
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 4,
    borderColor: '#FEE2E2',
  },
  buttonPressed: {
    transform: [{ translateY: 3 }],
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    width: 140,
    height: 70,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    position: 'absolute',
    top: 12,
    width: 110,
    height: 55,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  text: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 2,
  }
});
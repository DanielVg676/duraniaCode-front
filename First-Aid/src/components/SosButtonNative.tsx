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
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Capa de sombra profunda debajo
  shadowLayer: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#b91c1c',
    top: 10,
    elevation: 8,
    shadowColor: '#b91c1c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
  },

  // Botón principal con leve gradiente
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#dc2626',
    borderWidth: 6,
    borderColor: '#fecaca',

    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },

  // Efecto al presionarlo (simula un botón físico)
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },

  // Sombra interna para profundidad
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    width: 180,
    height: 90,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },

  // Contenido centrado
  content: {
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Brillo superior
  highlight: {
    position: 'absolute',
    width: 140,
    height: 70,
    top: 16,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },

  // Texto del botón
  text: {
    color: "white",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 3,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  }
});

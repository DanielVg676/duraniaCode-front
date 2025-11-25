import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, ViewStyle, View } from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

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
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowLayer: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#cc0000',
    top: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  button: {
    backgroundColor: '#ff4444',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: '#ff6666',
  },
  buttonPressed: {
    transform: [{ translateY: 4 }],
    elevation: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    width: 150,
    height: 75,
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  content: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    position: 'absolute',
    top: 15,
    width: 120,
    height: 60,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  }
});
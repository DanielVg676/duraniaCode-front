import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';

const { SmsModule } = NativeModules as {
  SmsModule?: {
    sendEmergencySms: (contacts: string[], message: string) => Promise<string>;
  };
};

interface SosButtonProps {
  contacts: string[];
  style?: ViewStyle;
}

export default function SosButton({ contacts, style }: SosButtonProps) {
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);

  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: "Permiso para enviar SMS",
          message:
            "LifeAid necesita permiso para enviar mensajes de texto a tus contactos de emergencia.",
          buttonNeutral: "Preguntar luego",
          buttonNegative: "Cancelar",
          buttonPositive: "Permitir",
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Error pidiendo permiso SMS:", err);
      return false;
    }
  };

  const handleSOS = async () => {
    if (!contacts || contacts.length === 0) {
      Alert.alert("Sin contactos", "Primero configura tus contactos de emergencia.");
      return;
    }

    console.log("🆘 INICIANDO SOS");
    console.log("📞 CONTACTOS SOS:", contacts);
    console.log("📞 Cantidad de contactos:", contacts.length);
    console.log("📞 Tipo de contactos:", typeof contacts);
    console.log("📞 Es array:", Array.isArray(contacts));

    setLoading(true);
    try {
      // 1. Pedir permiso de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permiso denegado", "Se requiere ubicación para enviar ayuda.");
        setLoading(false);
        return;
      }

      // 2. Obtener ubicación
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const mapLink = `http://maps.google.com/maps?q=${latitude},${longitude}`;
      const message = `¡AYUDA SOS! Estoy en una emergencia. Ubicación: ${mapLink}`;

      // 3. ANDROID: pedir permiso SMS y usar módulo nativo
      if (Platform.OS === "android" && SmsModule) {
        console.log("🔍 Verificando módulo nativo SmsModule:", SmsModule);

        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.SEND_SMS
        );
        console.log("📱 Permiso SMS ya concedido:", hasPermission);

        let canSend = hasPermission;

        if (!hasPermission) {
          console.log("⚠️ Solicitando permiso SMS...");
          canSend = await requestSmsPermission();
          console.log("📱 Permiso SMS obtenido:", canSend);
        }

        if (!canSend) {
          Alert.alert(
            "Permiso requerido",
            "No se puede enviar el SOS porque no se concedió el permiso de SMS."
          );
          setLoading(false);
          return;
        }

        try {
          console.log("📤 Enviando SMS nativo a:", contacts);
          console.log("💬 Mensaje:", message);

          const result = await SmsModule.sendEmergencySms(contacts, message);
          console.log("✅ Resultado SMS nativo:", result);

          Alert.alert(
            "SOS enviado",
            `Se enviaron mensajes de emergencia a ${contacts.length} contacto(s).`
          );
          setLoading(false);
          return;
        } catch (e: any) {
          console.error("❌ Error módulo nativo SMS:", e);
          console.error("❌ Código de error:", e?.code);
          console.error("❌ Mensaje de error:", e?.message);

          // Mostrar el error al usuario antes de caer al fallback
          Alert.alert(
            "Error al enviar SMS",
            `Error: ${e?.message || 'Desconocido'}. Intentando método alternativo...`
          );
          // cae al fallback abajo
        }
      }

      // 4. Fallback: expo-sms (abre app de mensajes o en iOS)
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "SMS no disponible en este dispositivo");
        setLoading(false);
        return;
      }

      const { result } = await SMS.sendSMSAsync(contacts, message);

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
      <View style={stylesButton.shadowLayer} />
      <TouchableOpacity
        style={[stylesButton.button, pressed && stylesButton.buttonPressed]}
        onPress={handleSOS}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={loading}
        activeOpacity={0.9}
      >
        <View style={stylesButton.innerShadow} />
        <View style={stylesButton.content}>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={stylesButton.text}>SOS</Text>
          )}
        </View>
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
// src/native/crash/index.ts
import { NativeModules, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

type CrashModuleType = {
  isMonitoring: () => Promise<boolean>;
  startMonitoring: () => Promise<boolean>;
  stopMonitoring: () => Promise<boolean>;
};

const { CrashModule } = NativeModules as {
  CrashModule: CrashModuleType;
};

// ¿Está activo el servicio?
export const isMonitoringActive = (): Promise<boolean> => {
  return CrashModule.isMonitoring();
};

// Solicitar permisos de notificación
const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Se necesita permiso de notificaciones para monitorear accidentes en segundo plano.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  }
  return true;
};

// Iniciar servicio
export const startCrashMonitoring = async (): Promise<boolean> => {
  try {
    // Primero solicitar permisos
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return false;
    }
    
    // Luego iniciar el servicio
    return await CrashModule.startMonitoring();
  } catch (error) {
    console.error('Error starting crash monitoring:', error);
    throw error;
  }
};

// Detener servicio
export const stopCrashMonitoring = (): Promise<boolean> => {
  return CrashModule.stopMonitoring();
};

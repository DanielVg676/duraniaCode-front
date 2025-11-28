import * as FileSystem from 'expo-file-system/legacy';
import { APP_CONFIG } from '../config/ai-config';

// Definimos la interfaz para el contexto de Whisper
interface WhisperContext {
  transcribe(
    audioUri: string,
    options?: {
      language?: string;
      maxLen?: number;
      tokenTimestamps?: boolean;
      speedUp?: boolean;
    }
  ): Promise<string | { result: string } | { text: string }>;
  release(): Promise<void>;
}

let whisperContext: WhisperContext | null = null;
let isInitialized = false;

/**
 * Inicializa el modelo Whisper
 */
export async function initializeWhisper(): Promise<boolean> {
  if (isInitialized && whisperContext) {
    return true;
  }

  if (!APP_CONFIG.WHISPER.ENABLED) {
    console.log('💡 Whisper deshabilitado en configuración.');
    return false;
  }

  try {
    console.log("🎤 Inicializando Whisper...");
    
    // Importar whisper.rn dinámicamente
    // @ts-ignore
    const whisperModule = await import('whisper.rn');
    const initWhisper = whisperModule.initWhisper || whisperModule.default?.initWhisper;
    
    if (!initWhisper) {
      throw new Error('initWhisper no disponible en whisper.rn');
    }
    
    // Ruta al modelo en el directorio de documentos
    const modelPath = `${(FileSystem as any).documentDirectory}models/${APP_CONFIG.WHISPER.MODEL_FILENAME}`;
    
    // Verificar si el modelo existe
    const fileInfo = await FileSystem.getInfoAsync(modelPath);
    if (!fileInfo.exists) {
      console.warn(`⚠️ Modelo Whisper no encontrado en: ${modelPath}`);
      return false;
    }
    
    console.log('📦 Cargando modelo Whisper:', modelPath);
    
    // Inicializar Whisper con el modelo
    whisperContext = await initWhisper({
      filePath: modelPath,
    });
    
    isInitialized = true;
    console.log("✅ Whisper inicializado correctamente");
    return true;
    
  } catch (error) {
    console.error("❌ Error al inicializar Whisper:", error);
    return false;
  }
}

/**
 * Transcribe audio usando Whisper offline
 */
export async function transcribeAudioOffline(audioUri: string): Promise<string> {
  try {
    if (!isInitialized || !whisperContext) {
      const success = await initializeWhisper();
      if (!success) {
        return "[Error: Modelo de voz no disponible]";
      }
    }

    console.log("🎤 Transcribiendo audio...");
    
    // Transcribir el audio
    const result = await whisperContext!.transcribe(audioUri, {
      language: APP_CONFIG.WHISPER.LANGUAGE,
      maxLen: 1,
      tokenTimestamps: false,
      speedUp: true,
    });
    
    // Extraer el texto de la transcripción
    let transcription = '';
    if (typeof result === 'string') {
      transcription = result;
    } else if (result && typeof result === 'object') {
      if ('result' in result && typeof result.result === 'string') {
        transcription = result.result;
      } else if ('text' in result && typeof result.text === 'string') {
        transcription = result.text;
      }
    }
    
    transcription = transcription.trim();
    console.log("✅ Transcripción completada:", transcription);
    
    return transcription || "[No se detectó audio claro]";
    
  } catch (error) {
    console.error("❌ Error en transcripción Whisper:", error);
    return "[Error al procesar el audio]";
  }
}

/**
 * Libera recursos de Whisper
 */
export async function releaseWhisper(): Promise<void> {
  if (whisperContext) {
    try {
      await whisperContext.release();
    } catch (e) {
      console.warn("Error al liberar Whisper:", e);
    }
    whisperContext = null;
    isInitialized = false;
    console.log('🔄 Whisper liberado');
  }
}

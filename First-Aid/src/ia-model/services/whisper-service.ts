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

/**
 * Transcribe audio usando Whisper offline
 */
export async function transcribeAudioOffline(audioUri: string): Promise<string> {
  try {
    console.log("🎤 Iniciando transcripción con Whisper...");
    
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
      return "[Error: Modelo de voz no encontrado]";
    }
    
    console.log('📦 Modelo Whisper:', modelPath);
    
    // Inicializar Whisper con el modelo
    const whisperContext: WhisperContext = await initWhisper({
      filePath: modelPath,
    });
    
    console.log("✅ Whisper inicializado, transcribiendo...");
    
    // Transcribir el audio
    const result = await whisperContext.transcribe(audioUri, {
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
    
    // Liberar recursos
    await whisperContext.release();
    
    return transcription || "[No se detectó audio claro]";
    
  } catch (error) {
    console.error("❌ Error en transcripción Whisper:", error);
    return "[Error al procesar el audio]";
  }
}

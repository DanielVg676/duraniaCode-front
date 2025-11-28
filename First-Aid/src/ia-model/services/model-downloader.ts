import * as FileSystem from 'expo-file-system/legacy';
import { APP_CONFIG } from '../config/ai-config';

export interface DownloadProgress {
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
  progress: number; // 0 to 1
}

export type ProgressCallback = (progress: DownloadProgress) => void;

/**
 * Verifica si los modelos existen
 */
export async function checkModelsExistence(): Promise<{ llm: boolean; whisper: boolean }> {
  const modelsDir = `${(FileSystem as any).documentDirectory}models/`;
  
  // Asegurar que el directorio existe
  const dirInfo = await FileSystem.getInfoAsync(modelsDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(modelsDir, { intermediates: true });
  }

  const llmPath = `${modelsDir}${APP_CONFIG.LLM.MODEL_FILENAME}`;
  const whisperPath = `${modelsDir}${APP_CONFIG.WHISPER.MODEL_FILENAME}`;

  const llmInfo = await FileSystem.getInfoAsync(llmPath);
  const whisperInfo = await FileSystem.getInfoAsync(whisperPath);

  return {
    llm: llmInfo.exists,
    whisper: whisperInfo.exists
  };
}

/**
 * Descarga el modelo Whisper
 */
export async function downloadWhisperModel(onProgress?: ProgressCallback): Promise<boolean> {
  const modelsDir = `${(FileSystem as any).documentDirectory}models/`;
  const fileUri = `${modelsDir}${APP_CONFIG.WHISPER.MODEL_FILENAME}`;
  const url = APP_CONFIG.WHISPER.MODEL_URL;

  if (!url) {
    console.error("❌ No URL configured for Whisper model");
    return false;
  }

  try {
    console.log(`⬇️ Iniciando descarga de Whisper desde ${url}`);
    
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        if (onProgress) {
          onProgress({
            totalBytesWritten: downloadProgress.totalBytesWritten,
            totalBytesExpectedToWrite: downloadProgress.totalBytesExpectedToWrite,
            progress
          });
        }
      }
    );

    const result = await downloadResumable.downloadAsync();
    console.log('✅ Whisper descargado:', result?.uri);
    return true;
  } catch (e) {
    console.error("❌ Error descargando Whisper:", e);
    return false;
  }
}

/**
 * Descarga el modelo LLM
 */
export async function downloadLLMModel(onProgress?: ProgressCallback): Promise<boolean> {
  const modelsDir = `${(FileSystem as any).documentDirectory}models/`;
  const fileUri = `${modelsDir}${APP_CONFIG.LLM.MODEL_FILENAME}`;
  const url = APP_CONFIG.LLM.MODEL_URL;

  if (!url) {
    console.error("❌ No URL configured for LLM model");
    return false;
  }

  try {
    console.log(`⬇️ Iniciando descarga de LLM desde ${url}`);
    
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        if (onProgress) {
          onProgress({
            totalBytesWritten: downloadProgress.totalBytesWritten,
            totalBytesExpectedToWrite: downloadProgress.totalBytesExpectedToWrite,
            progress
          });
        }
      }
    );

    const result = await downloadResumable.downloadAsync();
    console.log('✅ LLM descargado:', result?.uri);
    return true;
  } catch (e) {
    console.error("❌ Error descargando LLM:", e);
    return false;
  }
}

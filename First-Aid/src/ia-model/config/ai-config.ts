export const APP_CONFIG = {
  // Modo de IA: 'full' para LLM completo, 'lite' para respuestas predefinidas
  AI_MODE: 'full' as 'full' | 'lite',
  
  // Configuración del modelo LLM
  LLM: {
    ENABLED: true,
    CONTEXT_SIZE: 2048,      // Tamaño del contexto (tokens) - Phi-2 puede manejarlo
    BATCH_SIZE: 128,         // Tamaño del batch para procesamiento
    THREADS: 4,              // Número de threads para inferencia
    MODEL_NAME: 'Phi-2-Chat',
    MODEL_FILENAME: 'phi-2.Q4_K_M.gguf',
    MODEL_URL: 'https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf',
    MODEL_SIZE: '2.5 GB',
  },
  
  // Configuración de Whisper (Speech-to-Text)
  WHISPER: {
    ENABLED: true,
    MODEL_FILENAME: 'ggml-base.bin',
    MODEL_URL: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin',
    MODEL_SIZE: '150 MB',
    LANGUAGE: 'es',
  },
  
  // Configuración de emergencias
  EMERGENCY: {
    // Tiempo máximo de respuesta esperado (minutos)
    MAX_RESPONSE_TIME: 15,
    
    // Activar grabación automática de audio en emergencias
    AUTO_RECORD: true,
    
    // Activar ubicación en tiempo real
    LOCATION_TRACKING: true,
    
    // Intervalo de actualización de ubicación (milisegundos)
    LOCATION_UPDATE_INTERVAL: 5000,
  },
  
  // Configuración de rendimiento
  PERFORMANCE: {
    // Activar modo de bajo consumo
    LOW_POWER_MODE: false,
    
    // Cache de respuestas de IA
    CACHE_AI_RESPONSES: true,
    
    // Precarga de modelos al inicio
    PRELOAD_MODELS: false,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;

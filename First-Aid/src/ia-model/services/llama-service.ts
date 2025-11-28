import { initLlama, LlamaContext } from 'llama.rn';
import * as FileSystem from 'expo-file-system/legacy';
import { APP_CONFIG } from '../config/ai-config';
import { SYSTEM_PROMPT, EMERGENCY_MANUAL } from '../config/prompts';

let llamaContext: LlamaContext | null = null;
let isInitialized = false;

/**
 * Inicializa el modelo LLM
 */
export async function initializeLLM(): Promise<boolean> {
  if (isInitialized && llamaContext) {
    return true;
  }

  // Si el modo LLM está deshabilitado, retornar false inmediatamente
  if (!APP_CONFIG.LLM.ENABLED || APP_CONFIG.AI_MODE === 'lite') {
    console.log('💡 Modo LLM deshabilitado. Usando respuestas predefinidas.');
    return false;
  }

  try {
    console.log('🤖 Verificando modelo LLM...');
    
    // Ruta al modelo en el directorio de documentos
    const modelPath = `${(FileSystem as any).documentDirectory}models/${APP_CONFIG.LLM.MODEL_FILENAME}`;
    
    // Verificar si el modelo existe
    const fileInfo = await FileSystem.getInfoAsync(modelPath);
    if (!fileInfo.exists) {
      console.warn(`⚠️ Modelo no encontrado en: ${modelPath}`);
      return false;
    }
    
    console.log(`📍 Cargando modelo desde: ${modelPath}`);
    
    // Inicializar llama con configuración
    llamaContext = await initLlama({
      model: modelPath,
      n_ctx: APP_CONFIG.LLM.CONTEXT_SIZE,
      n_batch: APP_CONFIG.LLM.BATCH_SIZE,
      n_threads: APP_CONFIG.LLM.THREADS,
      use_mlock: false, 
    });

    isInitialized = true;
    console.log('✅ Modelo LLM cargado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al cargar modelo LLM:', error);
    return false;
  }
}

/**
 * Encuentra ejemplos relevantes basados en la categoría detectada
 */
function findRelevantExamples(userMessage: string): string {
  for (const category of EMERGENCY_MANUAL) {
    for (const example of category.examples) {
      if (userMessage.toLowerCase().includes(example.user.toLowerCase())) {
        return `Situación: "${example.user}"\nInstrucción: "${example.assistant}"`;
      }
    }
  }
  return '';
}

/**
 * Genera respuesta usando el modelo LLM
 */
export async function generateLLMResponse(
  userMessage: string,
  context: string = ''
): Promise<string> {
  if (!isInitialized || !llamaContext) {
    console.warn('⚠️ Modelo LLM no inicializado. Intentando inicializar...');
    const success = await initializeLLM();
    if (!success) {
      return '';
    }
  }

  try {
    // Buscar ejemplos relevantes
    const relevantExamples = findRelevantExamples(userMessage);

    // Prompt dinámico
    const prompt = `${SYSTEM_PROMPT}

Ejemplos:
${relevantExamples}

Contexto adicional: ${context}

Situación: "${userMessage}"
Instrucción:`;

    const response = await llamaContext!.completion(
      {
        prompt,
        n_predict: 100,
        temperature: 0.4,
        top_k: 40,
        top_p: 0.9,
        stop: ['\n\nSituación:', 'Ejemplos:', '###', '\n\n\n'],
      },
      (data) => {
        // Callback opcional para streaming de tokens
      }
    );

    // Limpieza de la respuesta
    let cleanText = response.text || '';
    cleanText = cleanText.replace(/\r?\n+/g, ' ').replace(/ {2,}/g, ' ');
    cleanText = cleanText.replace(/^['"]+|['"]+$/g, '');
    cleanText = cleanText.replace(/^(Instrucción:|Respuesta:|Asistente:)/gi, '');
    cleanText = cleanText.replace(/\s+\w{1,3}$/, '.');
    cleanText = cleanText.trim();

    if (cleanText && !/[.!?]$/.test(cleanText)) {
      cleanText += '.';
    }

    cleanText = cleanText.replace(/^asistente:\s*/i, '').trim();
    cleanText = cleanText.split(/Tareas?:/i)[0];
    cleanText = cleanText.split(/Tasks?:/i)[0];
    cleanText = cleanText.split(/Topic:/i)[0];

    return cleanText.trim() || 'Entendido. Mantén la calma y sigue mis instrucciones.';
  } catch (error) {
    console.error('❌ Error al generar respuesta LLM:', error);
    return '';
  }
}

/**
 * Libera recursos del modelo
 */
export async function releaseLLM(): Promise<void> {
  if (llamaContext) {
    await llamaContext.release();
    llamaContext = null;
    isInitialized = false;
    console.log('🔄 Modelo LLM liberado');
  }
}

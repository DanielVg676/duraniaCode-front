import { classifyEmergency, generateRuleBasedResponse, EmergencyType, EMERGENCY_KNOWLEDGE } from '../services/emergency-rules';
import { generateLLMResponse, initializeLLM } from '../services/llama-service';

export interface Message {
  id: number;
  text: string;
  sender: "ai" | "user";
}

/**
 * Genera respuesta contextual basada en el historial
 */
export async function generateContextualResponse(
  userMessage: string,
  emergencyType: EmergencyType,
  conversationHistory: { text: string; sender: "ai" | "user" }[],
  useLLM: boolean = false
): Promise<string> {
  // Intentar usar LLM si está disponible y habilitado
  if (useLLM) {
    try {
      const context = `Tipo de emergencia: ${emergencyType}. Historial: ${conversationHistory.slice(-3).map(m => `${m.sender}: ${m.text}`).join('. ')}`;
      const llmResponse = await generateLLMResponse(userMessage, context);
      
      if (llmResponse) {
        console.log('🤖 Respuesta generada por LLM');
        return llmResponse;
      }
    } catch (error) {
      console.warn('⚠️ Fallo al generar respuesta LLM, usando fallback');
    }
  }

  // Respuestas predefinidas como fallback (Reglas)
  const lowerMessage = userMessage.toLowerCase();
  
  // Respuestas a preguntas comunes
  if (lowerMessage.includes("cuánto") || lowerMessage.includes("cuando")) {
    return "Los servicios de emergencia generalmente llegan en 5-15 minutos dependiendo de tu ubicación. Ya están en camino.";
  }
  
  if (lowerMessage.includes("qué hago") || lowerMessage.includes("que debo")) {
    const response = EMERGENCY_KNOWLEDGE[emergencyType];
    return `${response.instructions[0]}. ${response.instructions[1]}.`;
  }
  
  if (lowerMessage.includes("dolor") || lowerMessage.includes("duele")) {
    return "Trata de mantener la calma y respirar profundamente. No te muevas innecesariamente. La ayuda está en camino.";
  }
  
  if (lowerMessage.includes("miedo") || lowerMessage.includes("asustado")) {
    return "Es normal sentir miedo. Estoy aquí contigo. Respira profundo, cuenta hasta 10. Los servicios de emergencia ya vienen.";
  }
  
  if (lowerMessage.includes("gracias")) {
    return "Estoy aquí para ayudarte. ¿Hay algo más que necesites mientras llega la ayuda?";
  }
  
  // Respuesta por defecto basada en el tipo de emergencia
  const ruleResponse = generateRuleBasedResponse(userMessage);
  if (ruleResponse && ruleResponse.type !== 'otro') {
      return ruleResponse.response;
  }

  return "Entendido. Permanece en tu ubicación actual. Los servicios de emergencia tienen tus coordenadas. ¿Necesitas algo más?";
}

// Re-exportar funciones útiles
export { classifyEmergency, initializeLLM };

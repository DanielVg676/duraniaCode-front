export type EmergencyType = 
  | "medica"
  | "incendio"
  | "accidente"
  | "robo"
  | "violencia"
  | "desastre"
  | "otro";

export interface EmergencyResponse {
  type: EmergencyType;
  priority: "critica" | "alta" | "media";
  response: string;
  instructions: string[];
  services: string[];
}

// Base de conocimiento offline para emergencias
export const EMERGENCY_KNOWLEDGE: Record<EmergencyType, EmergencyResponse> = {
  medica: {
    type: "medica",
    priority: "critica",
    response: "He detectado una emergencia médica. Los servicios de ambulancia han sido notificados.",
    instructions: [
      "Mantén la calma",
      "No muevas a la persona si hay trauma",
      "Si hay sangrado, aplica presión directa",
      "Si está inconsciente, colócalo de lado",
      "Permanece en línea conmigo"
    ],
    services: ["Ambulancia", "Hospital más cercano"]
  },
  
  incendio: {
    type: "incendio",
    priority: "critica",
    response: "Emergencia de incendio confirmada. Bomberos en camino a tu ubicación.",
    instructions: [
      "Evacúa el área inmediatamente",
      "Mantente agachado si hay humo",
      "No uses elevadores",
      "Toca las puertas antes de abrirlas",
      "Ve al punto de reunión más cercano"
    ],
    services: ["Bomberos", "Policía"]
  },
  
  accidente: {
    type: "accidente",
    priority: "alta",
    response: "Accidente reportado. Servicios de emergencia en camino.",
    instructions: [
      "Activa las luces de emergencia",
      "Coloca señales de advertencia",
      "No muevas vehículos si hay heridos",
      "Documenta la escena con fotos",
      "Intercambia información con otros involucrados"
    ],
    services: ["Policía de tránsito", "Ambulancia", "Grúa"]
  },
  
  robo: {
    type: "robo",
    priority: "alta",
    response: "Robo en progreso reportado. Policía notificada.",
    instructions: [
      "No confrontes al agresor",
      "Busca un lugar seguro",
      "Memoriza características del sospechoso",
      "No toques nada en la escena",
      "Permanece alerta de tu entorno"
    ],
    services: ["Policía"]
  },
  
  violencia: {
    type: "violencia",
    priority: "critica",
    response: "Situación de violencia detectada. Autoridades alertadas.",
    instructions: [
      "Aléjate del peligro inmediatamente",
      "Busca testigos si es posible",
      "No regreses a la zona de peligro",
      "Activa tu ubicación compartida",
      "Mantén esta línea abierta"
    ],
    services: ["Policía", "Servicios de protección"]
  },
  
  desastre: {
    type: "desastre",
    priority: "critica",
    response: "Desastre natural reportado. Coordinando con protección civil.",
    instructions: [
      "Busca refugio seguro inmediato",
      "Aléjate de ventanas y objetos que puedan caer",
      "Ten a mano documentos importantes",
      "Escucha las instrucciones oficiales",
      "Mantén tu teléfono cargado"
    ],
    services: ["Protección Civil", "Bomberos", "Cruz Roja"]
  },
  
  otro: {
    type: "otro",
    priority: "media",
    response: "Emergencia registrada. ¿Puedes darme más detalles sobre la situación?",
    instructions: [
      "Mantén la calma",
      "Describe tu situación",
      "Indica tu ubicación exacta",
      "Menciona si hay heridos",
      "Permanece en un lugar seguro"
    ],
    services: ["Servicios de emergencia generales"]
  }
};

// Palabras clave para clasificar emergencias
const EMERGENCY_KEYWORDS: Record<EmergencyType, string[]> = {
  medica: [
    "dolor", "sangre", "herido", "enfermo", "desmayo", "corazón", 
    "respirar", "convulsión", "ataque", "alergia", "inconsciente",
    "ambulancia", "hospital", "médico", "medicina"
  ],
  incendio: [
    "fuego", "incendio", "humo", "quemadura", "llamas", "gas",
    "bomberos", "quemar", "explosión", "calor"
  ],
  accidente: [
    "accidente", "choque", "colisión", "atropello", "volcadura",
    "auto", "carro", "moto", "vehículo", "tráfico"
  ],
  robo: [
    "robo", "ladrón", "asalto", "robar", "hurto", "robaron",
    "me quitaron", "amenaza", "arma", "pistola"
  ],
  violencia: [
    "violencia", "golpes", "agresión", "pelea", "atacar",
    "amenazar", "secuestro", "violación", "abuso"
  ],
  desastre: [
    "terremoto", "sismo", "inundación", "huracán", "tornado",
    "derrumbe", "deslizamiento", "tsunami", "tormenta"
  ],
  otro: []
};

/**
 * Clasifica el tipo de emergencia basado en el texto
 */
export function classifyEmergency(text: string): EmergencyType {
  const lowerText = text.toLowerCase();
  
  // Buscar coincidencias de palabras clave
  for (const [type, keywords] of Object.entries(EMERGENCY_KEYWORDS)) {
    if (type === "otro") continue;
    
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return type as EmergencyType;
      }
    }
  }
  
  return "otro";
}

/**
 * Genera respuesta de IA para la emergencia (Fallback)
 */
export function generateRuleBasedResponse(text: string): EmergencyResponse {
  const type = classifyEmergency(text);
  return EMERGENCY_KNOWLEDGE[type];
}

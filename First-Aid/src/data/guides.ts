// src/data/guides.ts

export interface GuideStep {
  title: string;
  content: string;
  warning: string | null;
}

export interface SpecialCase {
  condition: string;
  action: string;
}

export interface Guide {
  title: string;
  urgency: 'critical' | 'high' | 'medium';
  duration: string;
  description: string;
  steps: GuideStep[];
  specialCases?: SpecialCase[];
  tags: string[];
  keywords?: string; // Palabras ocultas para mejorar la búsqueda (sinónimos)
  gif?: any;
}

export const guides: Record<string, Guide> = {
  cpr: {
    title: 'RCP (Reanimación)',
    urgency: 'critical',
    duration: 'Continuo',
    description: 'Protocolo para paro cardíaco (la persona no responde y no respira).',
    gif: require('@/assets/cpr.gif'),
    steps: [
      { 
        title: 'Verificar Seguridad y Respuesta', 
        content: 'Asegure la escena. Golpee los hombros y grite "¿Está bien?". Observe si el pecho se mueve. Si no responde y no respira (o boquea), llame al 911.', 
        warning: 'No pierda tiempo buscando pulso si no es profesional.' 
      },
      { 
        title: 'Compresiones Torácicas', 
        content: 'Coloque el talón de una mano en el centro del pecho. Entrelace la otra encima. Comprima fuerte y rápido (5-6 cm de profundidad).', 
        warning: 'Ritmo: 100-120 por minuto (Ritmo de "Stayin Alive").' 
      },
      { 
        title: 'Vía Aérea', 
        content: 'Después de 30 compresiones, incline la cabeza hacia atrás y levante el mentón para abrir la vía aérea.', 
        warning: 'No haga esto si sospecha lesión de cuello, solo tracción mandibular.' 
      },
      { 
        title: 'Ventilaciones (Opcional)', 
        content: 'Si está capacitado, de 2 insuflaciones de 1 segundo cada una. Si no, continúe solo con compresiones.', 
        warning: 'Si el pecho no sube, repita la maniobra de cabeza.' 
      }
    ],
    specialCases: [
      {
        condition: 'Bebés (< 1 año)',
        action: 'Use solo 2 dedos en el centro del pecho. Comprima 4 cm. Cubra boca y nariz con su boca al ventilar.'
      },
      {
        condition: 'Ahogamiento / Asfixia',
        action: 'Es vital dar 5 ventilaciones INICIALES antes de comenzar con las compresiones.'
      }
    ],
    tags: ['Corazón', 'Paro', 'Desmayo'],
    keywords: 'resucitacion pecho compresiones latido muerte',
  },
  stroke: {
    title: 'Derrame Cerebral (ACV)',
    urgency: 'critical',
    duration: 'Inmediato',
    description: 'Interrupción del flujo sanguíneo al cerebro. ¡El tiempo es cerebro!',
    gif: require('@/assets/stroke.jpg.webp'),
    steps: [
      {
        title: 'Prueba RÁPIDO (F.A.S.T.)',
        content: 'Pida a la persona que sonría (Cara caída), que levante ambos brazos (Brazo débil) y que diga una frase simple (Habla extraña).',
        warning: 'Si falla CUALQUIERA de estas, llame al 911.'
      },
      {
        title: 'Llamar al 911',
        content: 'Indique claramente "Creo que es un derrame/ictus". Anote la hora exacta en que empezaron los síntomas.',
        warning: 'Existe una ventana de 3-4 horas para el tratamiento efectivo.'
      },
      {
        title: 'Reposo',
        content: 'Mantenga a la persona recostada con la cabeza ligeramente elevada. Tranquilícela.',
        warning: 'NO le de aspirina, comida ni agua (riesgo de asfixia o sangrado cerebral).'
      }
    ],
    specialCases: [
      {
        condition: 'Inconsciente',
        action: 'Coloque en posición lateral de seguridad y monitoree respiración. Inicie RCP si deja de respirar.'
      }
    ],
    tags: ['Cara', 'Habla', 'Brazo', 'Cerebro'],
    keywords: 'ictus embolia parálisis facial',
  },
  heart_attack: {
    title: 'Infarto Cardíaco',
    urgency: 'critical',
    duration: 'Inmediato',
    description: 'Bloqueo del flujo sanguíneo al corazón. La persona está consciente pero con dolor.',
    gif: require('@/assets/heartAttack.gif'),
    steps: [
      {
        title: 'Identificar',
        content: 'Dolor opresivo en el pecho ("como un elefante encima") que puede irse al brazo izquierdo, cuello o mandíbula. Sudor frío.',
        warning: 'En mujeres o diabéticos el dolor puede ser leve o parecer indigestión.'
      },
      {
        title: 'Posición',
        content: 'Siente a la persona en el suelo con la espalda apoyada (posición W). No la deje caminar.',
        warning: 'El esfuerzo físico empeora el daño.'
      },
      {
        title: 'Aspirina',
        content: 'Si no es alérgica, dele a masticar 1 aspirina de adulto (325mg) o 4 de bebé. Debe masticarla, no tragarla entera.',
        warning: 'No usar Ibuprofeno ni Paracetamol.'
      }
    ],
    specialCases: [
      {
        condition: 'Pierde el conocimiento',
        action: 'Ya no es solo un infarto, es un PARO CARDÍACO. Inicie RCP inmediatamente.'
      }
    ],
    tags: ['Pecho', 'Dolor', 'Brazo', 'Corazón'],
    keywords: 'ataque cardiaco miocardio presion',
  },
  bleeding: {
    title: 'Hemorragias',
    urgency: 'high',
    duration: '5-15 min',
    description: 'Control de sangrado externo severo para prevenir shock.',
    gif: require('@/assets/bleeding.gif'),
    steps: [
      { 
        title: 'Presión Directa', 
        content: 'Cubra la herida con gasa o tela limpia. Aplique presión firme y continua con la palma de la mano.', 
        warning: 'No retire la primera gasa si se empapa; ponga otra encima.' 
      },
      { 
        title: 'Empaquetamiento (Heridas profundas)', 
        content: 'Si la herida es profunda (cuello, axilas, ingles), introduzca gasa dentro de la herida hasta llenarla y presione fuerte.', 
        warning: 'No empaquete heridas en tórax o abdomen.' 
      },
      { 
        title: 'Vendaje Compresivo', 
        content: 'Vende firmemente sobre los apósitos para mantener la presión constante mientras llega ayuda.', 
        warning: 'Verifique que los dedos no se pongan morados (demasiada presión).' 
      }
    ],
    specialCases: [
      {
        condition: 'Objeto Incrustado',
        action: 'NUNCA retire el objeto (actúa como tapón). Inmovilícelo con vendas alrededor y presione los bordes.'
      },
      {
        condition: 'Paciente Diabético',
        action: 'Tienen mala coagulación y cicatrización. La presión debe mantenerse por más tiempo.'
      },
      {
        condition: 'Torniquete',
        action: 'Solo para hemorragias en extremidades que amenazan la vida y no paran con presión. Aplique 5-7 cm arriba de la herida.'
      }
    ],
    tags: ['Sangre', 'Corte', 'Herida'],
    keywords: 'cortada tajo amputacion venas arterias',
  },
  burns: {
    title: 'Quemaduras',
    urgency: 'medium',
    duration: '20 min',
    description: 'Lesiones por calor, químicos o electricidad.',
    gif: require('@/assets/burn.gif'),
    steps: [
      { 
        title: 'Enfriar la zona', 
        content: 'Deje correr agua a temperatura ambiente (grifo) sobre la zona por al menos 10-20 minutos.', 
        warning: 'NUNCA use hielo directo (quema más el tejido).' 
      },
      { 
        title: 'Retirar constricciones', 
        content: 'Quite anillos, pulseras o ropa INMEDIATAMENTE antes de que la zona se inflame.', 
        warning: 'No quite ropa que esté pegada a la piel; corte alrededor.' 
      },
      { 
        title: 'Proteger', 
        content: 'Cubra con film de plástico de cocina (sin apretar) o gasa estéril vaselinada.', 
        warning: 'No aplique pasta de dientes, aceite ni remedios caseros.' 
      }
    ],
    specialCases: [
      {
        condition: 'Quemadura Química (Polvo)',
        action: 'Cepille el polvo químico con guantes ANTES de echar agua, o podría activarlo.'
      },
      {
        condition: 'Quemadura Eléctrica',
        action: 'No toque a la persona hasta cortar la corriente. Busque dos heridas: entrada y salida. Monitoree el corazón.'
      },
      {
        condition: 'Ampollas',
        action: 'No las reviente. El líquido protege contra infecciones.'
      }
    ],
    tags: ['Fuego', 'Calor', 'Piel'],
    keywords: 'ardor solares electrica',
  },
  choking: {
    title: 'Atragantamiento (Heimlich)',
    urgency: 'critical',
    duration: 'Inmediato',
    description: 'Obstrucción de la vía aérea por cuerpo extraño.',
    gif: require('@/assets/choking.gif'),
    steps: [
      { 
        title: 'Animar a toser', 
        content: 'Si la persona puede hablar o toser, anímela a seguir tosiendo. No golpee la espalda todavía.', 
        warning: 'No intervenga si la tos es efectiva.' 
      },
      { 
        title: 'Maniobra de Heimlich', 
        content: 'Si deja de respirar/toser: Colóquese detrás. Puño sobre el ombligo. Cubra con la otra mano.', 
        warning: null 
      },
      { 
        title: 'Compresiones Abdominales', 
        content: 'Presione fuerte hacia adentro y hacia arriba (forma de J) repetidamente hasta que expulse el objeto.', 
        warning: 'Si pierde el conocimiento, inicie RCP.' 
      }
    ],
    specialCases: [
      {
        condition: 'Embarazadas u Obesos',
        action: 'Realice las compresiones en el centro del PECHO, no en el abdomen.'
      },
      {
        condition: 'Bebés',
        action: 'Alterne 5 golpes en la espalda (boca abajo) con 5 compresiones en el pecho (boca arriba). No use Heimlich.'
      }
    ],
    tags: ['Ahogo', 'Heimlich', 'Garganta'],
    keywords: 'atragantamiento comer respirar',
  },
  seizures: {
    title: 'Convulsiones',
    urgency: 'high',
    duration: '2-5 min',
    description: 'Actividad eléctrica cerebral anormal no controlada.',
    gif: require('@/assets/seizures.jpg'),
    steps: [
      { 
        title: 'Proteger cabeza', 
        content: 'Acueste a la persona y ponga algo suave (ropa, almohada) bajo su cabeza. Aleje muebles u objetos duros.', 
        warning: 'NUNCA sujete a la persona ni intente detener movimientos.' 
      },
      { 
        title: 'Vía Aérea', 
        content: 'NUNCA introduzca nada en la boca (cucharas, dedos, trapos). No se tragará la lengua.', 
        warning: 'Riesgo alto de asfixia o daño dental.' 
      },
      { 
        title: 'Post-Crisis', 
        content: 'Cuando termine, coloque a la persona de lado (Posición Lateral de Seguridad) para facilitar la respiración.', 
        warning: 'No de agua ni comida hasta que esté totalmente alerta.' 
      }
    ],
    specialCases: [
      {
        condition: 'Convulsión > 5 minutos',
        action: 'Llame al 911 inmediatamente. Es un "Estatus Epiléptico" y es mortal.'
      },
      {
        condition: 'Embarazada',
        action: 'Llame al 911 siempre. Puede ser Eclampsia (riesgo para madre y bebé).'
      }
    ],
    tags: ['Epilepsia', 'Temblores', 'Crisis'],
    keywords: 'ataque sacudidas espuma boca',
  },
  asthma: {
    title: 'Crisis Asmática',
    urgency: 'high',
    duration: 'Variable',
    description: 'Dificultad severa para respirar por cierre de vías aéreas.',
    gif: require('@/assets/asthma.gif'),
    steps: [
      {
        title: 'Posición',
        content: 'Siente a la persona recta e inclinada ligeramente hacia adelante. No la acueste.',
        warning: 'Acostarse dificulta más la respiración.'
      },
      {
        title: 'Inhalador',
        content: 'Use su inhalador de rescate (generalmente azul/Salbutamol). 2 disparos cada 20 minutos si es necesario.',
        warning: 'Si no tiene inhalador, llame al 911 ya.'
      },
      {
        title: 'Respiración',
        content: 'Anime a respiraciones lentas y profundas. Frunza los labios al exhalar (como apagando una vela).',
        warning: null
      }
    ],
    specialCases: [
      {
        condition: 'Sin Inhalador',
        action: 'El vapor de agua caliente o una taza de café fuerte (cafeína) pueden ayudar mínimamente mientras llega la ambulancia.'
      }
    ],
    tags: ['Respiración', 'Pecho', 'Aire'],
    keywords: 'inhalador ahogo silbido',
  },
  diabetes_low: {
    title: 'Bajón de Azúcar (Hipoglucemia)',
    urgency: 'high',
    duration: '15 min',
    description: 'Nivel peligrosamente bajo de glucosa en sangre.',
    gif: require('@/assets/diabe.jpg'),
    steps: [
      {
        title: 'Síntomas',
        content: 'Temblores, sudoración fría, confusión, irritabilidad, visión borrosa.',
        warning: 'Puede parecer ebriedad.'
      },
      {
        title: 'Regla 15-15',
        content: 'Si puede tragar: Dele 15g de azúcar rápido (medio vaso de jugo, 1 cucharada de miel, 3 caramelos duros).',
        warning: 'No use chocolate (la grasa retrasa la absorción).'
      },
      {
        title: 'Esperar',
        content: 'Espere 15 minutos. Si no mejora, repita la dosis de azúcar.',
        warning: null
      }
    ],
    specialCases: [
      {
        condition: 'Inconsciente',
        action: 'NUNCA de nada por la boca (se ahogará). Ponga de lado y llame al 911. Si tiene Glucagón inyectable, úselo.'
      }
    ],
    tags: ['Azúcar', 'Diabetes', 'Mareo'],
    keywords: 'insulina dulce coca cola',
  },
  fractures: {
    title: 'Fracturas',
    urgency: 'medium',
    duration: 'Inmovilizar',
    description: 'Pérdida de continuidad ósea.',
    gif: require('@/assets/fractura.gif'),
    steps: [
      { 
        title: 'No mover', 
        content: 'Deje la extremidad en la posición que la encontró, a menos que esté en peligro.', 
        warning: 'No intente "acomodar" el hueso.' 
      },
      { 
        title: 'Inmovilizar', 
        content: 'Use cartón, madera o revistas para ferulizar. Debe abarcar la articulación de arriba y la de abajo de la lesión.', 
        warning: 'No apriete demasiado las vendas.' 
      },
      { 
        title: 'Frío Local', 
        content: 'Aplique hielo indirecto (envuelto en tela) por 20 min para bajar inflamación y dolor.', 
        warning: null 
      }
    ],
    specialCases: [
      {
        condition: 'Fractura Expuesta (Hueso visible)',
        action: 'No toque el hueso ni intente meterlo. Cubra con gasa húmeda estéril y controle el sangrado alrededor.'
      },
      {
        condition: 'Diabéticos',
        action: 'Evite el frío extremo directo por tiempo prolongado, pueden tener neuropatía y no sentir quemaduras por frío.'
      }
    ],
    tags: ['Hueso', 'Golpe', 'Caída'],
    keywords: 'rotura quebrado ferula',
  },
  poisoning: {
    title: 'Intoxicaciones',
    urgency: 'high',
    duration: 'Variable',
    description: 'Ingesta, inhalación o contacto con tóxicos.',
    steps: [
      { 
        title: 'Seguridad', 
        content: 'Si es gas, ventile el área antes de entrar. Si es contacto, use guantes.', 
        warning: 'No se convierta en la segunda víctima.' 
      },
      { 
        title: 'Identificar', 
        content: 'Busque el envase. Llame al Centro de Toxicología o 911. Tenga a mano edad y peso aproximado.', 
        warning: 'No provoque el vómito sin orden médica.' 
      },
      { 
        title: 'Descontaminación', 
        content: 'Si cayó en piel/ojos, lave con agua corriente por 20 minutos continuos.', 
        warning: 'Retire ropa contaminada con cuidado.' 
      }
    ],
    specialCases: [
      {
        condition: 'Ingesta de Corrosivos (Cloro, Ácido)',
        action: 'NUNCA provocar vómito (quemaría el esófago al subir). No neutralizar con leche/vinagre (genera calor).'
      }
    ],
    tags: ['Veneno', 'Químico', 'Tóxico'],
    keywords: 'beber cloro pastillas sobredosis',
  },
  'insect-bites': {
    title: 'Picaduras y Alergias',
    urgency: 'medium',
    duration: '10-30 min',
    description: 'Reacciones locales o sistémicas a insectos.',
    steps: [
      { 
        title: 'Retirar aguijón', 
        content: 'Si es abeja, raspe con una tarjeta plástica. No use pinzas (inyectaría más veneno).', 
        warning: null 
      },
      { 
        title: 'Limpieza y Frío', 
        content: 'Lave con agua y jabón. Aplique hielo envuelto para reducir dolor e hinchazón.', 
        warning: null 
      },
      { 
        title: 'Elevar', 
        content: 'Si es en brazo o pierna, manténgalo elevado.', 
        warning: null 
      }
    ],
    specialCases: [
      {
        condition: 'Anafilaxia (Alergia Grave)',
        action: 'Si hay dificultad respiratoria, hinchazón de boca/lengua o mareo: Use EpiPen si la persona lo tiene. Llame al 911 YA.'
      },
      {
        condition: 'Picadura de Araña/Escorpión',
        action: 'Tome foto al insecto si es seguro. Mantenga a la persona quieta para no acelerar el veneno.'
      }
    ],
    tags: ['Alergia', 'Abeja', 'Araña'],
    keywords: 'roncha hinchazon aguijon',
  },
  head_injury: {
    title: 'Golpe en la Cabeza',
    urgency: 'high',
    duration: 'Vigilancia',
    description: 'Traumatismo craneoencefálico y posible conmoción.',
    steps: [
      {
        title: 'Inmovilizar',
        content: 'Si el golpe fue fuerte (caída de altura, accidente auto), no mueva el cuello. Sostenga la cabeza quieta.',
        warning: 'Riesgo de lesión medular.'
      },
      {
        title: 'Heridas',
        content: 'Si hay sangre, presione suavemente con un paño limpio (salvo que sienta hundimiento en el hueso).',
        warning: 'El cuero cabelludo sangra mucho, no se alarme por la cantidad.'
      },
      {
        title: 'Conmoción',
        content: 'Vigile: Vómitos, confusión, sueño excesivo, pupilas de diferente tamaño.',
        warning: 'Si presenta esto, al hospital urgente.'
      }
    ],
    specialCases: [
      {
        condition: 'Líquido en oídos/nariz',
        action: 'Si sale líquido claro o sangre, NO lo tape. Es signo de fractura de base de cráneo.'
      }
    ],
    tags: ['Cabeza', 'Golpe', 'Caída'],
    keywords: 'sangre contusion chichon',
  },
  eye_injury: {
    title: 'Lesiones en Ojos',
    urgency: 'medium',
    duration: 'Variable',
    description: 'Químicos, objetos extraños o golpes en el ojo.',
    steps: [
      {
        title: 'No frotar',
        content: 'Evite que la persona se toque o frote el ojo, causará más daño.',
        warning: null
      },
      {
        title: 'Químicos',
        content: 'Lave con agua corriente tibia por al menos 15 minutos. Mantenga el párpado abierto con los dedos.',
        warning: 'El agua debe caer desde la nariz hacia afuera para no contaminar el otro ojo.'
      },
      {
        title: 'Partículas (Polvo/Arena)',
        content: 'Parpadee repetidamente. Use lágrimas artificiales o agua para enjuagar.',
        warning: 'No use objetos (pañuelos/hisopos) para sacar la basura.'
      }
    ],
    specialCases: [
      {
        condition: 'Objeto Clavado',
        action: 'NUNCA lo retire. Cubra el ojo con un vaso de plástico pegado con cinta para protegerlo sin tocar. Tape también el ojo sano.'
      }
    ],
    tags: ['Ojo', 'Vista', 'Dolor'],
    keywords: 'basura irritacion',
  },
  snake_bite: {
    title: 'Mordedura de Serpiente',
    urgency: 'high',
    duration: 'Urgente',
    description: 'Envenenamiento por animal ponzoñoso.',
    steps: [
      {
        title: 'Inmovilizar',
        content: 'Mantenga la extremidad mordida quieta y por DEBAJO del nivel del corazón.',
        warning: 'Correr acelera el veneno.'
      },
      {
        title: 'Limpiar',
        content: 'Lave suavemente con agua y jabón. Quite anillos o relojes antes de que se hinche.',
        warning: 'NO succione el veneno. NO haga cortes. NO ponga torniquete.'
      },
      {
        title: 'Traslado',
        content: 'Lleve a la persona al hospital inmediatamente. Si es posible, tome foto a la serpiente desde lejos.',
        warning: 'No intente capturar al animal.'
      }
    ],
    tags: ['Veneno', 'Animal', 'Selva'],
    keywords: 'vibora culebra',
  },
  hypothermia: {
    title: 'Hipotermia',
    urgency: 'high',
    duration: 'Lento',
    description: 'Temperatura corporal peligrosamente baja.',
    steps: [
      { 
        title: 'Retirar del frío', 
        content: 'Lleve a la víctima a un lugar seco. Aíslela del suelo frío.', 
        warning: 'Trate con mucha suavidad (riesgo de paro cardíaco).' 
      },
      { 
        title: 'Ropa Seca', 
        content: 'Retire ropa mojada (córtela si es necesario). Cubra con mantas secas, incluyendo la cabeza.', 
        warning: null 
      },
      { 
        title: 'Recalentamiento Pasivo', 
        content: 'Aplique calor en axilas, ingles y cuello. No frote brazos ni piernas (lleva sangre fría al corazón).', 
        warning: 'No use agua caliente directa.' 
      }
    ],
    specialCases: [
      {
        condition: 'Congelación (Dedos negros/duros)',
        action: 'No frote. No intente descongelar si hay riesgo de que se vuelva a congelar. Separe dedos con gasas.'
      }
    ],
    tags: ['Frío', 'Congelación', 'Nieve'],
    keywords: 'temblor bajo cero',
  },
  shock: {
    title: 'Estado de Shock',
    urgency: 'critical',
    duration: 'Urgente',
    description: 'Flujo sanguíneo insuficiente a órganos vitales.',
    steps: [
      { 
        title: 'Llamar al 911', 
        content: 'Es una condición mortal. Requiere atención hospitalaria.', 
        warning: null 
      },
      { 
        title: 'Posición Antishock', 
        content: 'Acueste a la persona boca arriba. Eleve las piernas 30 cm para llevar sangre al cerebro.', 
        warning: 'No elevar si hay lesión en cabeza, cuello o columna.' 
      },
      { 
        title: 'Temperatura', 
        content: 'Cubra con una manta para evitar pérdida de calor. No use fuentes de calor externas.', 
        warning: 'No de nada de comer ni beber (riesgo de vómito).' 
      }
    ],
    specialCases: [
      {
        condition: 'Shock Cardiogénico (Infarto)',
        action: 'No eleve las piernas (dificulta el trabajo del corazón). Deje en posición semisentada.'
      }
    ],
    tags: ['Pálido', 'Pulso debil', 'Frío'],
    keywords: 'desvanecimiento presion baja',
  },
  fainting: {
    title: 'Desmayo (Síncope)',
    urgency: 'medium',
    duration: '2-5 min',
    description: 'Pérdida breve de la conciencia por baja presión.',
    steps: [
      { 
        title: 'Posición Segura', 
        content: 'Acueste a la persona boca arriba. Eleve las piernas por encima del nivel del corazón.', 
        warning: 'Asegure que respira bien.' 
      },
      { 
        title: 'Facilitar aire', 
        content: 'Afloje cinturones, corbatas o ropa ajustada. Pida a la gente que se aleje para dar aire.', 
        warning: null 
      },
      { 
        title: 'Recuperación', 
        content: 'No levante a la persona rápidamente. Siéntela gradualmente.', 
        warning: 'Si no despierta en 1-2 minutos, llame al 911 (no es un desmayo simple).' 
      }
    ],
    specialCases: [
      {
        condition: 'Embarazada',
        action: 'Recuéstela sobre su lado IZQUIERDO, no boca arriba (para no comprimir la vena cava).'
      }
    ],
    tags: ['Síncope', 'Mareo', 'Baja presión'],
    keywords: 'perder conocimiento caerse',
  },
  heatstroke: {
    title: 'Golpe de Calor',
    urgency: 'critical',
    duration: 'Inmediato',
    description: 'Fallo del sistema de regulación térmica corporal.',
    steps: [
      { 
        title: 'Enfriamiento Rápido', 
        content: 'Mueva a la sombra. Rocíe con agua y abanique. Aplique compresas frías en cuello, axilas e ingles.', 
        warning: 'Es una emergencia médica real.' 
      },
      { 
        title: 'Hidratación', 
        content: 'Solo si está consciente y puede tragar, de agua fresca a pequeños sorbos.', 
        warning: 'No de bebidas con cafeína o alcohol.' 
      }
    ],
    specialCases: [
      {
        condition: 'Piel seca y roja (Sin sudor)',
        action: 'Signo grave de golpe de calor clásico. Requiere enfriamiento inmersivo si es posible (sábanas mojadas).'
      }
    ],
    tags: ['Sol', 'Deshidratación', 'Calor'],
    keywords: 'insulacion insolacion',
  }
};
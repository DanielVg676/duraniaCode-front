// src/screens/GuideDetailScreen.tsx
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Phone, Siren } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface GuideDetailScreenProps {
  route?: any; // Para recibir parámetros de navegación si usas React Navigation nativo
  guideId?: string; // Por si lo pasas como prop directa
  onBack?: () => void;
  navigation?: any;
}

const GuideDetailScreen = ({ route, guideId: propGuideId, onBack, navigation }: GuideDetailScreenProps) => {
  // Manejo robusto del ID: puede venir por props directas o por route params
  const id = propGuideId || route?.params?.guideId;
  const [currentStep, setCurrentStep] = useState(0);

  const guides = {
    cpr: {
      title: 'Reanimación Cardiopulmonar (RCP)',
      urgency: 'critical',
      duration: '2-3 min/ciclo',
      description: 'Procedimiento para mantener flujo sanguíneo tras paro cardíaco.',
      steps: [
        { title: 'Verificar respuesta', content: 'Golpee suavemente los hombros y grite "¿Está bien?". Si no responde y no respira, actúe ya.', warning: 'Nunca practique en persona consciente.' },
        { title: 'Posición de manos', content: 'Coloque el talón de una mano en el centro del pecho (entre pezones). Entrelace la otra mano encima.', warning: 'Brazos rectos, hombros sobre manos.' },
        { title: 'Compresiones Fuertes', content: 'Comprima fuerte y rápido (5cm de profundidad). Deje que el pecho suba completamente.', warning: 'Ritmo: 100-120 por minuto.' },
        { title: 'Ventilaciones', content: 'Tras 30 compresiones, incline cabeza, levante mentón y dé 2 respiraciones boca a boca.', warning: '1 segundo por respiración.' },
        { title: 'Repetir Ciclo', content: 'Mantenga el ciclo 30:2 hasta que llegue la ayuda o la persona reaccione.', warning: 'Si hay desfibrilador (DEA), úselo.' }
      ]
    },
    bleeding: {
      title: 'Control de Hemorragias',
      urgency: 'high',
      duration: '5-10 min',
      description: 'Técnicas para detener sangrado severo.',
      steps: [
        { title: 'Protección', content: 'Póngase guantes si es posible. No toque la sangre directamente.', warning: 'Evite contacto con fluidos.' },
        { title: 'Presión Directa', content: 'Aplique presión fuerte directo sobre la herida con un paño o gasa limpia.', warning: 'No quite el paño si se empapa.' },
        { title: 'Elevación', content: 'Eleve la extremidad herida por encima del nivel del corazón si no hay fractura.', warning: null },
        { title: 'Vendaje compresivo', content: 'Vende firmemente sobre el apósito para mantener la presión.', warning: 'No corte la circulación total.' }
      ]
    },
    burns: {
      title: 'Quemaduras',
      urgency: 'medium',
      duration: '15-20 min',
      description: 'Enfriamiento y protección de la piel quemada.',
      steps: [
        { title: 'Enfriar zona', content: 'Deje correr agua fría (no helada) sobre la quemadura por 10-20 minutos.', warning: 'NUNCA use hielo directo.' },
        { title: 'Retirar objetos', content: 'Quite anillos o ropa ajustada antes de que la zona se hinche.', warning: 'No quite ropa pegada a la piel.' },
        { title: 'Cubrir', content: 'Cubra con gasa estéril o film de cocina limpio (sin apretar).', warning: 'No use algodón (se pega).' },
        { title: 'No aplicar remedios', content: 'No use mantequilla, pasta dental ni aceites.', warning: 'Solo agua y cobertura limpia.' }
      ]
    },
    fractures: {
        title: 'Fracturas',
        urgency: 'medium',
        duration: 'Inmovilizar',
        description: 'Manejo de lesiones óseas antes del hospital.',
        steps: [
          { title: 'No mover', content: 'No intente acomodar el hueso. Evite mover la extremidad.', warning: 'El movimiento causa más daño.' },
          { title: 'Inmovilizar', content: 'Fije la extremidad como la encontró usando tablillas o cartón.', warning: 'Incluya las articulaciones cercanas.' },
          { title: 'Frío local', content: 'Aplique hielo envuelto en tela para bajar inflamación.', warning: 'No hielo directo a la piel.' },
          { title: 'Traslado', content: 'Acuda a urgencias manteniendo la inmovilización.', warning: null }
        ]
    },
    choking: {
      title: 'Maniobra Heimlich',
      urgency: 'critical',
      duration: 'Inmediato',
      description: 'Desobstrucción de vía aérea por atragantamiento.',
      steps: [
        { title: 'Evaluar', content: 'Pregunte "¿Te estás ahogando?". Si no puede hablar ni toser, actúe.', warning: 'Si tose fuerte, anímelo a seguir.' },
        { title: 'Posición', content: 'Póngase detrás. Rodee la cintura con sus brazos.', warning: null },
        { title: 'Puño', content: 'Cierre un puño sobre el ombligo (boca del estómago). Sujete con la otra mano.', warning: null },
        { title: 'Compresiones J', content: 'Empuje fuerte hacia adentro y hacia arriba (forma de J). Repita.', warning: 'Hasta que expulse el objeto.' }
      ]
    },
    seizures: {
        title: 'Convulsiones',
        urgency: 'high',
        duration: 'Variable',
        description: 'Protección durante crisis epiléptica.',
        steps: [
          { title: 'Seguridad', content: 'Aleje objetos duros o filosos. Ponga algo suave bajo la cabeza.', warning: 'No sujete a la persona.' },
          { title: 'Tiempo', content: 'Mire el reloj. Si dura más de 5 min, llame al 911.', warning: 'No meta nada en la boca.' },
          { title: 'Pos-crisis', content: 'Cuando termine, ponga a la persona de lado (posición de seguridad).', warning: 'Permita que descanse.' },
          { title: 'Revisión', content: 'Verifique que respire bien. Acompañe hasta que despierte.', warning: null }
        ]
    },
    poisoning: {
        title: 'Intoxicaciones',
        urgency: 'high',
        duration: 'Variable',
        description: 'Ingesta de sustancias o picaduras.',
        steps: [
          { title: 'Identificar', content: 'Busque el envase o causa. No provoque el vómito salvo indicación médica.', warning: 'Llame a toxicología/911.' },
          { title: 'Piel/Ojos', content: 'Si es contacto externo, lave con abundante agua 15 min.', warning: 'Quite ropa contaminada.' },
          { title: 'Vapores', content: 'Saque a la persona al aire fresco inmediatamente.', warning: 'Cuídese usted de no inhalar.' },
          { title: 'Signos', content: 'Vigile respiración y consciencia mientras llega ayuda.', warning: null }
        ]
    },
    'insect-bites': {
        title: 'Picaduras',
        urgency: 'medium',
        duration: '10 min',
        description: 'Reacciones a insectos.',
        steps: [
          { title: 'Aguijón', content: 'Si es abeja, raspe el aguijón con una tarjeta. No use pinzas.', warning: null },
          { title: 'Limpieza', content: 'Lave con agua y jabón. Aplique frío local.', warning: null },
          { title: 'Alergia Grave', content: 'Si hay hinchazón de cara/boca o dificultad para respirar, es ANFILAXIA.', warning: 'Use Epipen si tiene y llame 911.' },
          { title: 'Observar', content: 'Mantenga vigilada a la persona por 30 min.', warning: null }
        ]
    },
    hypothermia: {
        title: 'Hipotermia',
        urgency: 'high',
        duration: 'Gradual',
        description: 'Baja temperatura corporal peligrosa.',
        steps: [
          { title: 'Refugio', content: 'Lleve a lugar seco y protegido del viento.', warning: 'Mueva con suavidad.' },
          { title: 'Ropa seca', content: 'Quite ropa mojada. Envuelva en mantas secas.', warning: 'Cubra la cabeza.' },
          { title: 'Calor gradual', content: 'Aplique calor en pecho, cuello e ingles. No frote extremidades.', warning: 'No use agua caliente directa.' },
          { title: 'Bebidas', content: 'Si está consciente, de bebidas tibias y dulces.', warning: 'No alcohol ni cafeína.' }
        ]
    },
    shock: {
        title: 'Estado de Shock',
        urgency: 'critical',
        duration: 'Urgente',
        description: 'Falla circulatoria crítica.',
        steps: [
          { title: '911', content: 'Llame a emergencias inmediatamente.', warning: 'Es mortal sin tratamiento.' },
          { title: 'Posición', content: 'Acueste boca arriba. Eleve piernas 30cm (si no hay trauma espinal).', warning: null },
          { title: 'Temperatura', content: 'Cubra con manta para evitar pérdida de calor.', warning: null },
          { title: 'No dar nada', content: 'No de comida ni líquidos.', warning: 'Puede broncoaspirar.' }
        ]
    },
    fainting: {
        title: 'Desmayo',
        urgency: 'medium',
        duration: '2-5 min',
        description: 'Pérdida breve de consciencia.',
        steps: [
          { title: 'Posición', content: 'Acueste boca arriba y levante las piernas.', warning: 'Asegure vía aérea.' },
          { title: 'Aire', content: 'Afloje ropa apretada (cuello, cinturón). Ventile el área.', warning: null },
          { title: 'Recuperación', content: 'Si despierta, no deje que se levante rápido.', warning: 'Si no despierta en 1 min, llame 911.' },
          { title: 'Líquidos', content: 'Solo de agua si está totalmente alerta.', warning: null }
        ]
    },
    heatstroke: {
        title: 'Golpe de Calor',
        urgency: 'critical',
        duration: 'Inmediato',
        description: 'Exceso de temperatura corporal.',
        steps: [
          { title: 'Enfriar YA', content: 'Mueva a sombra. Moje con agua y abanique.', warning: 'Es emergencia médica.' },
          { title: 'Hielo', content: 'Ponga bolsas de hielo en axilas, ingles y cuello.', warning: null },
          { title: 'Hidratación', content: 'Si puede beber, de agua a sorbos.', warning: 'Si vomita, detenga.' },
          { title: 'Vigilancia', content: 'Monitoree temperatura hasta que baje a 38°C.', warning: null }
        ]
    }
  };

  const currentGuide = guides[id as keyof typeof guides];
  const handleBack = onBack || (() => navigation?.goBack());

  if (!currentGuide) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <AlertTriangle size={48} color="#94a3b8" />
        <Text className="text-slate-500 mt-4 text-lg">Guía no encontrada</Text>
        <TouchableOpacity onPress={handleBack} className="mt-4 bg-blue-600 px-6 py-2 rounded-full">
            <Text className="text-white font-bold">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStepData = currentGuide.steps[currentStep];
  const isLastStep = currentStep === currentGuide.steps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = (currentStep + 1) / currentGuide.steps.length;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar style="light" />

      {/* HEADER CURVO AZUL */}
      <View className="bg-[#002e90] pt-12 pb-8 px-6 rounded-b-[32px] shadow-lg z-10">
        {/* Top Bar */}
        <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 pr-4">
                <TouchableOpacity 
                    onPress={handleBack}
                    className="flex-row items-center mb-3 bg-white/20 self-start px-3 py-1.5 rounded-full"
                >
                    <ArrowLeft size={16} color="white" />
                    <Text className="text-white font-medium ml-1 text-sl">Atrás</Text>
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-white leading-tight">
                    {currentGuide.title}
                </Text>
            </View>
            
            {/* Botón de Emergencia en Header */}
            <TouchableOpacity 
                onPress={() => Linking.openURL('tel:911')}
                className="bg-red-500 p-3 rounded-2xl items-center justify-center shadow-lg shadow-red-900/40"
            >
                <Phone size={50} color="white" />
                <Text className="text-white font-bold text-[10px] mt-1">SOS</Text>
            </TouchableOpacity>
        </View>

        {/* Info Tags */}
        <View className="flex-row items-center gap-3">
            <View className={`px-3 py-1 rounded-lg ${getUrgencyColor(currentGuide.urgency)}`}>
                <Text className="text-xs font-bold text-white uppercase tracking-wider">
                    {currentGuide.urgency === 'critical' ? 'Crítico' : currentGuide.urgency === 'high' ? 'Alto' : 'Medio'}
                </Text>
            </View>
            <View className="flex-row items-center bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                <Clock size={14} color="#bfdbfe" />
                <Text className="text-blue-100 text-xs ml-2 font-medium">{currentGuide.duration}</Text>
            </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Descripción rápida */}
        <View className="mb-6 flex-row items-start">
            <View className="bg-blue-100 dark:bg-slate-800 p-2 rounded-xl mr-3 mt-1">
                <Siren size={20} color="#002e90" />
            </View>
            <Text className="text-slate-600 dark:text-slate-300 text-md leading-5 flex-1 mt-1">
                {currentGuide.description}
            </Text>
        </View>

        {/* PROGRESS INDICATOR */}
        <View className="mb-6">
            <View className="flex-row justify-between mb-2">
                <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Paso {currentStep + 1} / {currentGuide.steps.length}
                </Text>
                <Text className="text-slate-400 font-bold text-xs">{Math.round(progress * 100)}%</Text>
            </View>
            <View className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <View 
                    style={{ width: `${progress * 100}%` }} 
                    className="h-full bg-[#002e90] rounded-full"
                />
            </View>
        </View>

        {/* TARJETA DEL PASO PRINCIPAL */}
        <View className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-6 min-h-[280px]">
            <View className="flex-row items-center mb-6">
                <View className="bg-blue-50 dark:bg-blue-900/30 w-12 h-12 rounded-full items-center justify-center mr-4 border border-blue-100 dark:border-blue-800">
                    <Text className="text-2xl font-extrabold text-[#002e90] dark:text-blue-300">
                        {currentStep + 1}
                    </Text>
                </View>
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 flex-1 leading-6">
                    {currentStepData.title}
                </Text>
            </View>

            <Text className="text-lg text-slate-600 dark:text-slate-300 leading-7 mb-6">
                {currentStepData.content}
            </Text>

            {/* Warning Box (Si existe) */}
            {currentStepData.warning && (
                <View className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-2xl p-4 flex-row items-start">
                    <AlertTriangle size={50} color="#f97316" style={{ marginTop: 2 }} />
                    <View className="ml-3 flex-1">
                        <Text className="text-orange-700 dark:text-orange-400 font-bold text-sm uppercase mb-1">Precaución</Text>
                        <Text className="text-orange-800 dark:text-orange-200 text-md leading-5">
                            {currentStepData.warning}
                        </Text>
                    </View>
                </View>
            )}
        </View>

      </ScrollView>

      {/* CONTROLES INFERIORES */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 p-5 border-t border-slate-100 dark:border-slate-800 flex-row gap-4">
        
        {/* Botón Anterior */}
        <TouchableOpacity
            onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={isFirstStep}
            className={`flex-1 py-4 rounded-2xl items-center justify-center border ${
                isFirstStep 
                ? 'bg-slate-50 border-slate-200 opacity-50' 
                : 'bg-white border-slate-300 active:bg-slate-50'
            }`}
        >
            <Text className={`font-bold ${isFirstStep ? 'text-slate-300' : 'text-slate-600'}`}>
                Anterior
            </Text>
        </TouchableOpacity>

        {/* Botón Siguiente / Terminar */}
        <TouchableOpacity
            onPress={() => {
                if (isLastStep) {
                    handleBack();
                } else {
                    setCurrentStep(currentStep + 1);
                }
            }}
            className={`flex-1 py-4 rounded-2xl items-center justify-center flex-row shadow-lg shadow-blue-900/20 ${
                isLastStep ? 'bg-green-600' : 'bg-[#002e90]'
            }`}
        >
            <Text className="text-white font-bold text-lg mr-2">
                {isLastStep ? 'Terminar' : 'Siguiente'}
            </Text>
            {isLastStep ? <CheckCircle2 size={20} color="white" /> : <ArrowRight size={20} color="white" />}
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default GuideDetailScreen;
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { AlertTriangle, ArrowLeft, ArrowRight, Clock, Phone, ArrowLeft as StepLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';

interface GuideDetailScreenProps {
  guideId: string;
  onBack: () => void;
}

const GuideDetailScreen = ({ guideId, onBack }: GuideDetailScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Static guide data (would be loaded from local storage in real app)
  const guides = {
    cpr: {
      title: 'Reanimación Cardiopulmonar (RCP)',
      urgency: 'critical',
      duration: '2-3 minutos por ciclo',
      description: 'Procedimiento de emergencia para mantener el flujo sanguíneo cuando el corazón se detiene.',
      steps: [
        { title: 'Verificar respuesta', content: 'Toque los hombros de la persona y grite "¿Está bien?". Si no responde, pida ayuda inmediatamente.', warning: 'Nunca practique RCP en una persona consciente' },
        { title: 'Posición correcta', content: 'Coloque a la persona boca arriba en una superficie firme. Incline la cabeza hacia atrás y levante el mentón.', warning: null },
        { title: 'Posición de las manos', content: 'Coloque el talón de una mano en el centro del pecho, entre los pezones. Ponga la otra mano encima, entrelazando los dedos.', warning: 'Mantenga los brazos rectos' },
        { title: 'Compresiones', content: 'Comprima fuerte y rápido al menos 5 cm de profundidad. Deje que el pecho se eleve completamente entre compresiones.', warning: 'Ritmo: 100-120 compresiones por minuto' },
        { title: 'Ventilaciones', content: 'Después de 30 compresiones, incline la cabeza, levante el mentón y dé 2 respiraciones boca a boca.', warning: 'Cada respiración debe durar 1 segundo' },
        { title: 'Continuar ciclos', content: 'Alterne 30 compresiones con 2 respiraciones. No se detenga hasta que llegue ayuda médica.', warning: 'Cambie con otra persona cada 2 minutos si es posible' }
      ]
    },
    bleeding: {
      title: 'Control de Hemorragias',
      urgency: 'high',
      duration: '5-10 minutos',
      description: 'Técnicas para controlar el sangrado y prevenir la pérdida excesiva de sangre.',
      steps: [
        { title: 'Seguridad personal', content: 'Use guantes desechables o una barrera protectora. Evite el contacto directo con la sangre.', warning: 'Protéjase de enfermedades transmisibles' },
        { title: 'Presión directa', content: 'Aplique presión firme y constante directamente sobre la herida con un paño limpio o gasa.', warning: 'No retire el material si se empapa de sangre' },
        { title: 'Elevación', content: 'Si es posible, eleve la parte lesionada por encima del nivel del corazón mientras mantiene la presión.', warning: 'Solo si no hay fractura sospechosa' },
        { title: 'Vendaje de presión', content: 'Asegure el material absorbente con vendas, manteniendo presión constante sobre la herida.', warning: 'No ate demasiado fuerte para no cortar circulación' }
      ]
    },
    burns: {
      title: 'Tratamiento de Quemaduras',
      urgency: 'medium',
      duration: '10-15 minutos',
      description: 'Primeros auxilios para diferentes tipos de quemaduras.',
      steps: [
        { title: 'Enfriar la quemadura', content: 'Enfríe la quemadura con agua fría (no helada) durante 10-20 minutos.', warning: 'No use hielo ni agua muy fría' },
        { title: 'Retirar objetos', content: 'Quite anillos, relojes y ropa suelta antes de que aparezca hinchazón.', warning: 'No retire ropa que esté pegada a la piel' },
        { title: 'Cubrir la quemadura', content: 'Cubra con un paño limpio y húmedo o film transparente.', warning: 'No aplique cremas, mantequilla o remedios caseros' },
        { title: 'Manejo del dolor', content: 'Administre analgésicos de venta libre si la persona está consciente.', warning: 'Busque atención médica para quemaduras graves' }
      ]
    },
    fractures: {
      title: 'Primeros Auxilios para Fracturas',
      urgency: 'medium',
      duration: '10-15 minutos',
      description: 'Cómo inmovilizar y reducir riesgos antes de recibir atención médica.',
      steps: [
        { title: 'No mover innecesariamente', content: 'Mantenga inmóvil la extremidad lesionada. Evite mover a la persona salvo que sea absolutamente necesario.', warning: 'Mover puede agravar la fractura' },
        { title: 'Inmovilizar', content: 'Use tablillas o cualquier objeto rígido para mantener el hueso en posición estable.', warning: 'Inmovilice articulaciones arriba y abajo del hueso fracturado' },
        { title: 'Aplicar frío', content: 'Coloque compresas frías o hielo envuelto en tela para reducir inflamación.', warning: 'No coloque hielo directamente sobre la piel' },
        { title: 'Buscar ayuda médica', content: 'Lleve a la persona a urgencias o llame a emergencias lo antes posible.', warning: 'Fracturas abiertas requieren atención inmediata' }
      ]
    },
    choking: {
      title: 'Maniobra de Heimlich (Ahogamiento)',
      urgency: 'critical',
      duration: '1-3 minutos',
      description: 'Acciones rápidas para desobstruir las vías respiratorias.',
      steps: [
        { title: 'Verificar obstrucción', content: 'Pregunte si la persona puede toser o hablar. Si no puede, actúe inmediatamente.', warning: 'No golpee la espalda si está tosiendo con fuerza' },
        { title: 'Posicionarse detrás', content: 'Colóquese detrás de la persona y rodee su cintura con ambos brazos.', warning: null },
        { title: 'Compresiones abdominales', content: 'Cierre un puño y colóquelo justo arriba del ombligo. Sujete con la otra mano y empuje fuerte hacia adentro y arriba.', warning: 'Repita hasta que salga el objeto o pierda consciencia' },
        { title: 'Si pierde consciencia', content: 'Lleve a la persona al suelo y comience RCP inmediatamente.', warning: 'Llame a emergencias cuanto antes' }
      ]
    },
    seizures: {
      title: 'Manejo de Convulsiones',
      urgency: 'high',
      duration: 'Hasta que termine la convulsión',
      description: 'Medidas seguras para proteger a la persona durante una crisis epiléptica.',
      steps: [
        { title: 'Mantener la calma', content: 'Cronometre la convulsión y permanezca junto a la persona.', warning: 'Convulsiones mayores a 5 minutos requieren ayuda inmediata' },
        { title: 'Proteger la cabeza', content: 'Coloque algo blando debajo de la cabeza para evitar golpes.', warning: 'No intente sujetar a la persona' },
        { title: 'Retirar objetos cercanos', content: 'Asegure el área quitando objetos peligrosos o duros alrededor.', warning: null },
        { title: 'Posición de recuperación', content: 'Una vez termine la convulsión, coloque a la persona de lado para mantener la vía aérea abierta.', warning: 'No ponga nada en la boca durante la convulsión' }
      ]
    },
    // Guías agregadas para las existentes en allGuides que faltaban
    poisoning: {
      title: 'Intoxicaciones y Mordeduras',
      urgency: 'high',
      duration: 'Variable',
      description: 'Primeros auxilios para diferentes tipos de envenenamiento, incluyendo mordeduras y picaduras venenosas.',
      steps: [
        { title: 'Evaluar la situación', content: 'Mantenga la calma. Identifique la sustancia tóxica o el animal si es posible. No pruebe el veneno.', warning: 'Llame inmediatamente al centro de toxicología o emergencias.' },
        { title: 'Para intoxicación ingerida', content: 'No provoque vómito a menos que lo indique un profesional. Si la persona vomita, despeje las vías respiratorias.', warning: 'No dé nada por boca si está inconsciente.' },
        { title: 'Para mordeduras de serpiente', content: 'Mantenga a la persona calmada. Inmovilice la zona afectada por debajo del nivel del corazón. Retire anillos o prendas constrictivas.', warning: 'No haga incisiones ni succione el veneno.' },
        { title: 'Para mordeduras de animales', content: 'Lave la herida con jabón y agua durante 3-5 minutos. Cubra con un vendaje limpio.', warning: 'Busque atención médica para posible rabia.' },
        { title: 'Monitoreo', content: 'Vigile signos vitales y espere ayuda médica.', warning: null }
      ]
    },
    'insect-bites': {
      title: 'Picaduras y Reacciones Alérgicas',
      urgency: 'high',
      duration: '5-10 minutos inicial',
      description: 'Tratamiento para picaduras, mordeduras y reacciones alérgicas graves.',
      steps: [
        { title: 'Remover el aguijón', content: 'Si hay aguijón (como en abejas), quítelo raspando con una tarjeta, no con pinzas.', warning: null },
        { title: 'Limpiar el área', content: 'Lave con agua y jabón. Aplique hielo envuelto en tela por 10 minutos.', warning: 'Repita el proceso de hielo.' },
        { title: 'Para reacciones alérgicas graves (anafilaxia)', content: 'Use autoinyector de epinefrina si disponible. Llame a emergencias.', warning: 'Coloque a la persona acostada con piernas elevadas si no hay vómito.' },
        { title: 'Monitorear síntomas', content: 'Vigile por hinchazón, dificultad para respirar. Administre antihistamínicos si es leve.', warning: 'Busque ayuda si empeora.' }
      ]
    },
    hypothermia: {
      title: 'Hipotermia',
      urgency: 'high',
      duration: 'Hasta recuperación',
      description: 'Tratamiento para la pérdida peligrosa de temperatura corporal.',
      steps: [
        { title: 'Mover a lugar cálido', content: 'Suavemente, mueva a la persona fuera del frío. Proteja del suelo frío.', warning: 'Maneje con cuidado para evitar lesiones.' },
        { title: 'Quitar ropa mojada', content: 'Con delicadeza quite la ropa mojada y reemplácela con ropa seca o mantas.', warning: null },
        { title: 'Calentar gradualmente', content: 'Aplique compresas cálidas en cuello, pecho y groin. Ofrezca bebidas calientes si consciente.', warning: 'No use agua caliente ni alcohol. No frote.' },
        { title: 'Monitorear', content: 'Si no respira, inicie RCP. Llame a emergencias.', warning: 'Para hipotermia severa, no intente recalentar rápidamente.' }
      ]
    },
    shock: {
      title: 'Estado de Shock',
      urgency: 'critical',
      duration: 'Hasta ayuda llegue',
      description: 'Reconocimiento y tratamiento del shock médico.',
      steps: [
        { title: 'Llamar a emergencias', content: 'Llame al 911 inmediatamente.', warning: null },
        { title: 'Posicionar', content: 'Acueste a la persona boca arriba y eleve las piernas unos 30 cm, si no hay lesión en cabeza o piernas.', warning: 'Si sospecha lesión espinal, no mueva.' },
        { title: 'Mantener cálido', content: 'Cubra con mantas para mantener temperatura. Afloje ropa apretada.', warning: 'No dé comida ni bebida.' },
        { title: 'Monitorear', content: 'Revise respiración y pulso. Inicie CPR si necesario. Tranquilice a la persona.', warning: 'Mantenga inmóvil.' }
      ]
    },
    // Nuevas guías agregadas para búsquedas sugeridas
    fainting: {
      title: 'Desmayo',
      urgency: 'high',
      duration: '5-10 minutos',
      description: 'Primeros auxilios para pérdida temporal de conciencia.',
      steps: [
        { title: 'Posicionar', content: 'Coloque a la persona acostada boca arriba con piernas elevadas unos 30 cm.', warning: 'Asegúrese que las vías respiratorias estén despejadas.' },
        { title: 'Verificar signos vitales', content: 'Revise si respira y tiene pulso. Si no, inicie CPR y llame a emergencias.', warning: null },
        { title: 'Aflojar ropa', content: 'Afloje corbatas, cuellos o ropa apretada. Proporcione aire fresco.', warning: null },
        { title: 'Recuperación', content: 'Una vez consciente, haga que se siente lentamente. Ofrezca agua si está alerta.', warning: 'No permita levantarse rápidamente. Busque causa subyacente.' }
      ]
    },
    heatstroke: {
      title: 'Golpe de Calor',
      urgency: 'critical',
      duration: 'Inmediato',
      description: 'Emergencia por exposición al calor extremo.',
      steps: [
        { title: 'Llamar a emergencias', content: 'Llame al 911 de inmediato.', warning: null },
        { title: 'Mover a sombra', content: 'Traslade a un lugar fresco y con sombra o aire acondicionado.', warning: null },
        { title: 'Enfriar el cuerpo', content: 'Quite ropa excesiva. Aplique compresas frías o hielo en cuello, axilas, groin. Rocíe con agua fría y abanique.', warning: 'No dé bebidas si inconsciente.' },
        { title: 'Monitorear', content: 'Vigile signos vitales. No dé medicamentos para fiebre.', warning: 'Si vomita, gire de lado.' }
      ]
    }
  };

  const currentGuide = guides[guideId as keyof typeof guides];
  
  if (!currentGuide) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted-foreground">Guía no encontrada</Text>
      </View>
    );
  }

  const currentStepData = currentGuide.steps[currentStep];
  const isLastStep = currentStep === currentGuide.steps.length - 1;
  const isFirstStep = currentStep === 0;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-emergency text-emergency-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '🚨 CRÍTICO';
      case 'high': return '⚠️ ALTO';
      default: return '🔔 MEDIO';
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header Moderno */}
      <View className="bg-white border-b border-slate-100 shadow-sm">
        <View className="pt-4 pb-4 px-5">
          <View className="flex-row items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onPress={onBack}
              className="mr-2 -ml-2"
            >
              <ArrowLeft size={20} color="#64748B" />
            </Button>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-800" numberOfLines={2}>
                {currentGuide.title}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-4" style={{ gap: 8 }}>
            <Badge className={`${getUrgencyColor(currentGuide.urgency)} px-3 py-1.5 rounded-full`}>
              <Text className="text-xs font-bold">
                {getUrgencyLabel(currentGuide.urgency)}
              </Text>
            </Badge>
            <View className="flex-row items-center bg-slate-100 px-3 py-1.5 rounded-full">
              <Clock size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text className="text-xs font-semibold text-slate-600">{currentGuide.duration}</Text>
            </View>
          </View>
          
          <Button 
            className="w-full bg-red-500 h-14 rounded-2xl shadow-lg shadow-red-200 active:scale-95"
            onPress={() => Linking.openURL('tel:911')}
          >
            <View className="flex-row items-center justify-center gap-3">
              <Phone size={20} color="white" fill="white" />
              <Text className="text-white font-bold text-base">Llamar Emergencias 911</Text>
            </View>
          </Button>
        </View>
      </View>

      {/* Guide Content */}
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 py-6">
          {/* Descripción */}
          <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
            <Text className="text-slate-700 leading-relaxed text-sm">
              {currentGuide.description}
            </Text>
          </View>

          {/* Step Progress */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-slate-800">
                Paso {currentStep + 1} de {currentGuide.steps.length}
              </Text>
              <Text className="text-xs text-slate-500 font-medium">
                {Math.round(((currentStep + 1) / currentGuide.steps.length) * 100)}% Completado
              </Text>
            </View>
            
            {/* Barra de progreso */}
            <View className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <View 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                style={{ 
                  width: `${((currentStep + 1) / currentGuide.steps.length) * 100}%` 
                }}
              />
            </View>
            
            {/* Indicadores de pasos */}
            <View className="flex-row justify-between mt-3" style={{ gap: 4 }}>
              {currentGuide.steps.map((step, index) => {
                let stepColor = 'bg-slate-300';
                if (index === currentStep) {
                  stepColor = 'bg-blue-600';
                } else if (index < currentStep) {
                  stepColor = 'bg-green-500';
                }
                
                return (
                  <View
                    key={`step-${index}-${step.title}`}
                    className={`flex-1 h-1.5 rounded-full ${stepColor}`}
                  />
                );
              })}
            </View>
          </View>

          {/* Current Step Card */}
          <Card className="mb-6 bg-white rounded-3xl shadow-lg border-0 overflow-hidden">
            <CardHeader className="pb-3 pt-6 px-6">
              <View className="flex-row items-center mb-2" style={{ gap: 12 }}>
                <View className="bg-blue-600 rounded-2xl w-12 h-12 items-center justify-center shadow-md shadow-blue-300">
                  <Text className="text-xl font-bold text-white">
                    {currentStep + 1}
                  </Text>
                </View>
                <Text className="text-xl font-bold text-slate-800 flex-1" numberOfLines={2}>
                  {currentStepData.title}
                </Text>
              </View>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Text className="text-slate-700 mb-4 leading-relaxed text-base">
                {currentStepData.content}
              </Text>
              
              {currentStepData.warning && (
                <View className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex-row items-start" style={{ gap: 10 }}>
                  <View className="bg-orange-100 p-2 rounded-xl">
                    <AlertTriangle size={20} color="#f97316" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-orange-800 mb-1">
                      ⚠️ IMPORTANTE
                    </Text>
                    <Text className="text-sm text-orange-900 leading-relaxed">
                      {currentStepData.warning}
                    </Text>
                  </View>
                </View>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <View className="flex-row mb-6" style={{ gap: 12 }}>
            <Button
              variant="outline"
              className={`flex-1 h-14 rounded-2xl border-2 ${
                isFirstStep ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-300'
              }`}
              onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={isFirstStep}
            >
              <View className="flex-row items-center justify-center gap-2">
                <StepLeft size={18} color={isFirstStep ? "#CBD5E1" : "#64748B"} />
                <Text className={`font-bold ${isFirstStep ? 'text-slate-400' : 'text-slate-700'}`}>
                  Anterior
                </Text>
              </View>
            </Button>
            
            <Button
              className={`flex-1 h-14 rounded-2xl shadow-lg ${
                isLastStep ? 'bg-green-500 shadow-green-200' : 'bg-blue-600 shadow-blue-200'
              }`}
              onPress={() => setCurrentStep(Math.min(currentGuide.steps.length - 1, currentStep + 1))}
              disabled={isLastStep}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-white font-bold text-base">
                  {isLastStep ? '✓ Completado' : 'Siguiente'}
                </Text>
                {!isLastStep && <ArrowRight size={18} color="white" />}
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuideDetailScreen;
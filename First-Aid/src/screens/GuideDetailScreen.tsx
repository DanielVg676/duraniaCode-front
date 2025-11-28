import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Phone, Shield, Siren } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';

// IMPORTACIÓN DE LOS DATOS SEPARADOS
import { guides } from '@/data/guides';

interface GuideDetailScreenProps {
  route?: any;
  guideId?: string;
  onBack?: () => void;
  navigation?: any;
}

const GuideDetailScreen = ({ route, guideId: propGuideId, onBack, navigation }: GuideDetailScreenProps) => {
  const id = propGuideId || route?.params?.guideId;
  const [currentStep, setCurrentStep] = useState(0);

  // NOTA: Ya no declaramos 'const guides = ...' aquí porque lo importamos arriba.
  
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
      {/* <StatusBar style="light" /> */}

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
                    {/* Corregí 'text-sl' (no existe) a 'text-sm' */}
                    <Text className="text-white font-medium ml-1 text-sm">Atrás</Text>
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
            <Text className="text-slate-600 dark:text-slate-300 text-base leading-5 flex-1 mt-1">
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
                        <Text className="text-orange-800 dark:text-orange-200 text-base leading-5">
                            {currentStepData.warning}
                        </Text>
                    </View>
                </View>
            )}
        </View>
        {currentGuide.gif && (
            <View className="mb-6 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                <View className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> 
                    <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Demostración Visual
                    </Text>
                </View>
                <Image 
                    source={currentGuide.gif} 
                    style={{ width: '100%', height: 220 }} 
                    resizeMode="cover" // O "contain" si quieres ver todo el borde
                />
            </View>
        )}
        {/* SECCIÓN: CASOS ESPECIALES (NUEVO) */}
        {currentGuide.specialCases && currentGuide.specialCases.length > 0 && (
            <View className="mb-6">
                <View className="flex-row items-center mb-3 ml-1">
                    <Shield size={18} color="#64748B" />
                    <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest ml-2">
                        Variantes y Precauciones
                    </Text>
                </View>

                {currentGuide.specialCases.map((special, index) => (
                    <View 
                        key={index} 
                        className="bg-slate-100 dark:bg-slate-800/50 border-l-4 border-indigo-500 rounded-r-xl p-4 mb-3"
                    >
                        <Text className="text-indigo-700 dark:text-indigo-400 font-bold text-sm mb-1">
                            SI: {special.condition}
                        </Text>
                        <Text className="text-slate-600 dark:text-slate-300 text-sm leading-5">
                            {special.action}
                        </Text>
                    </View>
                ))}
            </View>
        )}
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
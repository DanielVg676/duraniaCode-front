import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import * as Speech from 'expo-speech';
import {
  Bot,
  Mic,
  Phone,
  Send,
  User,
  Volume2,
  VolumeX,
  X,
  Sparkles
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';


interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const StatusDot = ({ isActive }: { isActive: boolean }) => {
  const opacity = useSharedValue(1);

  // Efecto para disparar la animación cuando isActive cambia
  React.useEffect(() => {
    if (isActive) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1, // Infinito
        true // Reverse
      );
    } else {
      opacity.value = withTiming(1); // Reset a opacidad completa
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: isActive ? '#4ade80' : '#22c55e', // green-400 vs green-500
  }));

  return (
    <Animated.View 
      style={[{ width: 8, height: 8, borderRadius: 4 }, animatedStyle]} 
    />
  );
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hola, soy tu asistente FirstAId. 🚑\nEstoy aquí para guiarte paso a paso. Manten la calma y dime, ¿cuál es la emergencia?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => {
      speak('Hola, soy tu asistente FirstAId. Estoy aquí para guiarte. ¿Cuál es la emergencia?');
    }, 1000);

    return () => {
      Speech.stop();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled) return;
    try {
      Speech.stop();
      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'es-ES',
        pitch: 1,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    } catch (error) {
      setIsSpeaking(false);
    }
  }, [ttsEnabled]);

  const stopSpeaking = useCallback(() => {
    try {
      Speech.stop();
      setIsSpeaking(false);
    } catch (error) {}
  }, []);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages.length, isTyping]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInputValue("Tengo un corte profundo en el brazo");
        setIsRecording(false);
      }, 2000);
    }
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    if (message.includes('sangra') || message.includes('herida') || message.includes('corte')) {
      return 'Para controlar una hemorragia:\n\n1. Ponte guantes o usa una barrera protectora\n2. Aplica presión directa sobre la herida con un paño limpio\n3. Mantén presión constante\n4. Eleva la zona afectada\n\n¿El sangrado es abundante?';
    }
    return 'Entendido. Por favor, mantén la calma. Describe:\n\n• ¿La persona está consciente?\n• ¿Respira con dificultad?\n\nEstoy analizando tu respuesta...';
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(userMessage.content),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      speak(aiResponse.content);
    }, 2000);
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isUser = message.sender === 'user';
    return (
      <View className={`flex ${isUser ? 'items-end' : 'items-start'} mb-6 px-4`}>
        <View className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 max-w-[90%]`}>
          <View className={`w-10 h-10 rounded-full items-center justify-center shadow-md ${
            isUser ? 'bg-indigo-600' : 'bg-white'
          }`} style={{ elevation: 4 }}>
            {isUser ? (
                <User size={20} color="white" />
            ) : (
                <Bot size={24} color="#002e90" />
            )}
          </View>
          
          <View className={`p-4 rounded-3xl shadow-sm ${
            isUser 
              ? 'bg-indigo-600 rounded-br-sm' 
              : 'bg-white rounded-bl-sm border border-slate-100'
          }`} style={{ elevation: 2 }}>
            <Text className={`text-[15px] leading-6 ${
              isUser ? 'text-white font-medium' : 'text-slate-800'
            }`}>
              {message.content}
            </Text>
            <Text className={`text-[10px] mt-2 text-right ${
              isUser ? 'text-indigo-200' : 'text-slate-400'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    return (
        <View className="flex items-start mb-6 px-4">
            <View className="flex flex-row items-end gap-3">
                <View className="w-10 h-10 rounded-full items-center justify-center bg-white shadow-md border border-slate-50">
                    <Bot size={24} color="#002e90" />
                </View>
                <View className="bg-white p-4 rounded-3xl rounded-bl-sm border border-slate-100 shadow-sm min-w-[80px]">
                    <Text className="text-slate-400 font-bold text-xl tracking-widest leading-4">
                        ...
                    </Text>
                </View>
            </View>
        </View>
    );
  };

  const getAssistantStatus = () => {
    if (isTyping) return 'Escribiendo...';
    if (isSpeaking) return 'Hablando...';
    return 'En línea';
  };

  // Determinar si hay actividad para mostrar el punto verde animado
  const isActive = isTyping || isSpeaking;

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* <StatusBar style="light" /> */}

      {/* HEADER */}
      <View className="bg-[#002e90] pt-12 pb-6 px-5 rounded-b-[32px] shadow-lg z-10">
        <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
                <View className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
                    <Sparkles size={24} color="#60a5fa" fill="#60a5fa" /> 
                </View>
                <View>
                    <Text className="font-bold text-xl text-white tracking-tight">FirstAId IA</Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                        <StatusDot isActive={isActive} />
                        <Text className="text-xs text-blue-100 font-medium opacity-90">
                            {getAssistantStatus()}
                        </Text>
                    </View>
                </View>
            </View>
            
            <View className="flex-row items-center gap-2">
                <TouchableOpacity 
                    onPress={() => {
                        setTtsEnabled(!ttsEnabled);
                        if (isSpeaking) stopSpeaking();
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/5"
                >
                    {ttsEnabled ? <Volume2 size={18} color="white" /> : <VolumeX size={18} color="#94a3b8" />}
                </TouchableOpacity>

                <TouchableOpacity 
                    className="bg-red-500 w-10 h-10 rounded-full items-center justify-center shadow-lg shadow-red-900/40"
                    activeOpacity={0.8}
                >
                    <Phone size={18} color="white" fill="white" />
                </TouchableOpacity>
            </View>
        </View>
      </View>

      {/* LISTA DE MENSAJES */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderTypingIndicator}
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* FOOTER (INPUT AREA) */}
      <View className="bg-white dark:bg-slate-800 pb-32 pt-2 border-t border-slate-50 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-[30px]">
        
        {!isTyping && (
            <View className="mb-3 px-2">
                <FlatList 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={['Sangrado fuerte', 'Quemadura', 'RCP', 'Me siento mareado', 'Fractura']}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => setInputValue(item)}
                            className="mr-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-2xl active:bg-blue-50"
                        >
                            <Text className="text-slate-600 dark:text-slate-300 text-xs font-semibold">{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )}

        <View className="px-4 flex-row items-center gap-3">
            <TouchableOpacity
                onPress={toggleRecording}
                className={`h-12 w-12 rounded-full items-center justify-center transition-all ${
                    isRecording 
                    ? 'bg-red-500 shadow-red-200 shadow-lg scale-110' 
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}
            >
                {isRecording ? (
                    <View className="w-4 h-4 bg-white rounded-sm animate-pulse" />
                ) : (
                    <Mic size={22} className="text-slate-600 dark:text-slate-400" color="#64748B" />
                )}
            </TouchableOpacity>

            <View className="flex-1 h-12 text-slate-700 dark:text-slate-200 text-base h-full bg-transparent border-0 p-0">
                <Input
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder={isRecording ? "Escuchando..." : "Escribe aquí..."}
                    placeholderTextColor="#94A3B8"
                    editable={!isTyping && !isRecording}
                    onSubmitEditing={sendMessage}
                    className="flex-1 h-12 text-slate-700 dark:text-slate-200 text-base h-full bg-transparent border-0 p-0"
                />
            </View>
            
            <TouchableOpacity 
                onPress={sendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`h-12 w-12 rounded-full items-center justify-center transition-all ${
                    inputValue.trim() 
                    ? 'bg-[#002e90] shadow-lg shadow-blue-200 scale-100' 
                    : 'bg-slate-200 dark:bg-slate-700 scale-95'
                }`}
            >
                <Send size={20} color={inputValue.trim() ? "white" : "#94A3B8"} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
        </View>

        {isRecording && (
            <View className="absolute -top-12 left-0 right-0 items-center">
                <View className="bg-red-500 px-5 py-2 rounded-full shadow-lg flex-row items-center gap-2">
                    <View className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <View className="w-2 h-2 bg-white rounded-full animate-bounce delay-75" />
                    <View className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
                    <Text className="text-white font-bold text-xs ml-1">GRABANDO</Text>
                </View>
            </View>
        )}
      </View>

    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
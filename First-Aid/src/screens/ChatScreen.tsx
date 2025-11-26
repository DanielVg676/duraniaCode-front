import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import * as Speech from 'expo-speech';
import { Bot, Mic, Phone, Send, User, Volume2, VolumeX, X } from 'lucide-react-native'; // Añadido Volume2 y VolumeX
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hola, soy tu asistente FirstAId. 🚑\nEstoy aquí para guiarte. ¿Cuál es la emergencia?',
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

  // Leer mensaje de bienvenida
  useEffect(() => {
    setTimeout(() => {
      speak('Hola, soy tu asistente FirstAId. Estoy aquí para guiarte. ¿Cuál es la emergencia?');
    }, 1000);

    return () => {
      Speech.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para hablar el texto
  const speak = useCallback((text: string) => {
    if (!ttsEnabled) return;
    
    try {
      Speech.stop();
      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'es-ES',
        pitch: 1,
        rate: 0.6,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    } catch (error) {
      console.error('Error al hablar:', error);
      setIsSpeaking(false);
    }
  }, [ttsEnabled]);

  // Función para detener el habla
  const stopSpeaking = useCallback(() => {
    try {
      Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error al detener:', error);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 100);
  }, [messages, scrollToBottom]);

  // Lógica simulada del micrófono
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simular que escucha y escribe algo
      setTimeout(() => {
        setInputValue("Tengo un corte profundo en el brazo");
        setIsRecording(false);
      }, 2000);
    }
  };

  // Simulated AI responses (Misma lógica, solo simplifiqué para el ejemplo visual)
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
      
      // Leer la respuesta de la IA en voz alta
      speak(aiResponse.content);
    }, 1500);
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isUser = message.sender === 'user';
    return (
      <View className={`flex ${isUser ? 'items-end' : 'items-start'} mb-6 px-2`}>
        <View className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%]`}>
          
          {/* Avatar Pequeño */}
          <View className={`w-8 h-8 rounded-full items-center justify-center mb-1 shadow-sm ${
            isUser ? 'bg-blue-600' : 'bg-white border border-blue-100'
          }`}>
            {isUser ? <User size={14} color="white" /> : <Bot size={16} color="#2563EB" />}
          </View>
          
          {/* Burbuja de Chat */}
          <View className={`p-4 rounded-2xl shadow-sm ${
            isUser 
              ? 'bg-blue-600 dark:bg-blue-500 rounded-br-none' 
              : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-none'
          }`}>
            <Text className={`text-base leading-6 ${
              isUser ? 'text-white font-medium' : 'text-slate-700 dark:text-slate-200'
            }`}>
              {message.content}
            </Text>
            <Text className={`text-[10px] mt-1 text-right ${
              isUser ? 'text-blue-200 dark:text-blue-300' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Calcular el estado del asistente
  const getAssistantStatus = () => {
    if (isTyping) return 'Analizando...';
    if (isSpeaking) return 'Hablando...';
    return 'En línea';
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-slate-50 dark:bg-slate-900" // Fondo general suave (gris muy claro)
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header Estilizado */}
      <View className="bg-white dark:bg-slate-800 pt-12 pb-4 px-4 flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700 shadow-sm z-10">
        <View className="flex-row items-center gap-3">
          <View className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl">
            <Bot size={24} className="text-blue-600" color="#2563EB" />
          </View>
          <View>
            <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">FirstAId IA</Text>
            <View className="flex-row items-center gap-1">
              <View className={`w-2 h-2 rounded-full ${isTyping ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
              <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {getAssistantStatus()}
              </Text>
            </View>
          </View>
        </View>
        
        <View className="flex-row items-center gap-2">
          {/* Botón TTS Toggle */}
          <Button 
            variant="ghost"
            size="icon"
            onPress={() => {
              setTtsEnabled(!ttsEnabled);
              if (isSpeaking) {
                stopSpeaking();
              }
            }}
            className={`w-10 h-10 rounded-full ${ttsEnabled ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}
          >
            {ttsEnabled ? (
              <Volume2 size={20} color="#2563EB" />
            ) : (
              <VolumeX size={20} color="#64748B" />
            )}
          </Button>

          <Button 
            variant="destructive" 
            size="sm"
            className="bg-red-500 hover:bg-red-600 rounded-full px-4 shadow-sm flex-row gap-2"
          >
            <Phone size={16} color="white" fill="white" />
            <Text className="text-white font-bold ml-1">SOS 911</Text>
          </Button>
        </View>
      </View>

      {/* Área de Mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Sugerencias Rápidas (Chips) */}
      {!isTyping && (
        <View className="pl-4 py-3" style={{ backgroundColor: 'transparent' }}>
           <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['Desmayo', 'Sangrado', 'Quemadura', 'Fractura', 'RCP']}
            keyExtractor={(item) => item}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setInputValue(item)}
                className="mr-2 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-5 py-2.5 rounded-full shadow-sm"
              >
                <Text className="text-blue-600 dark:text-blue-400 text-sm font-semibold">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Input Area */}
      <View className="bg-white dark:bg-slate-800 px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex-row items-end gap-2 pb-32">
        
        {/* Botón de Micrófono */}
        <Button
          variant="ghost"
          size="icon"
          onPress={toggleRecording}
          className={`h-12 w-12 rounded-full ${
            isRecording ? 'bg-red-50 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700'
          }`}
        >
          {isRecording ? (
            <X size={22} className="text-red-500" color="#EF4444" />
          ) : (
            <Mic size={22} className="text-slate-600" color="#475569" />
          )}
        </Button>

        {/* Campo de Texto */}
        <Input
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={isRecording ? "Escuchando..." : "Describe la emergencia..."}
          placeholderTextColor="#94A3B8"
          editable={!isTyping && !isRecording}
          onSubmitEditing={sendMessage}
          containerClassName="flex-1 bg-slate-100 dark:bg-slate-700 rounded-3xl px-4 border-0"
          className="text-slate-700 dark:text-slate-200 text-base"
        />
        
        {/* Botón Enviar */}
        <Button 
          onPress={sendMessage}
          disabled={!inputValue.trim() || isTyping}
          className={`h-12 w-12 rounded-full items-center justify-center ${
            inputValue.trim() ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-200'
          }`}
        >
          <Send size={20} color={inputValue.trim() ? "white" : "#94A3B8"} />
        </Button>
      </View>

      {/* Overlay visual para cuando graba (Opcional) */}
      {isRecording && (
        <View className="absolute bottom-24 left-0 right-0 items-center justify-center">
          <View className="bg-red-500 px-4 py-2 rounded-full shadow-lg flex-row items-center gap-2 animate-pulse">
            <View className="w-2 h-2 bg-white rounded-full" />
            <Text className="text-white font-bold text-xs">GRABANDO AUDIO...</Text>
          </View>
        </View>
      )}

    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
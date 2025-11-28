import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import {
  Bot,
  Mic,
  Phone,
  Send,
  User,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Download
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, NavigationContext } from '@react-navigation/native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence
} from 'react-native-reanimated';

import {
  transcribeAudioOffline,
  generateContextualResponse,
  classifyEmergency,
  initializeLLM
} from '../ia-model';
import { checkModelsExistence, downloadLLMModel, downloadWhisperModel, DownloadProgress } from '../ia-model/services/model-downloader';

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
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [llmInitialized, setLlmInitialized] = useState(false);
  const [emergencyType, setEmergencyType] = useState<string>("otro");

  // Estados de descarga
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');

  const flatListRef = useRef<FlatList>(null);

  // Verificar contexto de navegación
  const navigation = useNavigation();
  const navContext = useContext(NavigationContext);

  useEffect(() => {
    if (!navContext) {
      console.error("❌ ChatScreen rendered OUTSIDE NavigationContext!");
      Alert.alert("Error Crítico", "ChatScreen fuera de contexto de navegación.");
    } else {
      console.log("✅ ChatScreen mounted with NavigationContext");
    }
  }, []);

  // Verificar y descargar modelos
  useEffect(() => {
    const checkAndDownload = async () => {
      const { llm, whisper } = await checkModelsExistence();

      if (!llm || !whisper) {
        setIsDownloading(true);
        setDownloadStatus('Descargando modelos de IA...');

        if (!whisper) {
          setDownloadStatus('Descargando modelo de voz (150MB)...');
          await downloadWhisperModel((p) => setDownloadProgress(p.progress * 0.5)); // 50%
        }

        if (!llm) {
          setDownloadStatus('Descargando modelo de chat (2.5GB)... esto puede tardar.');
          await downloadLLMModel((p) => setDownloadProgress(0.5 + (p.progress * 0.5))); // 50-100%
        }

        setDownloadStatus('Inicializando...');
        setIsDownloading(false);
      }

      // Inicializar LLM después de asegurar que existen
      initializeLLM().then(success => {
        setLlmInitialized(success);
        if (success) {
          console.log('✅ LLM cargado y listo en ChatScreen');
        }
      });
    };

    checkAndDownload();
  }, []);

  // Permisos de Audio
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permisos necesarios",
            "Necesitamos acceso al micrófono para escuchar tu emergencia. Por favor habilítalo en la configuración.",
            [{ text: "OK" }]
          );
        }
      } catch (e) {
        console.error("Error solicitando permisos:", e);
      }
    })();
  }, []);

  useEffect(() => {
    // Configurar audio mode una sola vez al montar
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    }).catch(err => console.error("Error configurando audio mode:", err));

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
    } catch (error) { }
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

  // Lógica de Grabación
  const startRecording = async () => {
    if (isDownloading) {
      Alert.alert("Espere", "Estamos descargando los modelos de IA necesarios.");
      return;
    }

    try {
      const permission = await Audio.getPermissionsAsync();
      if (permission.status !== 'granted') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Sin permiso", "No podemos grabar audio sin permiso de micrófono.");
          return;
        }
      }

      stopSpeaking();
      setIsRecording(true);

      // Asegurar configuración de audio antes de grabar
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
    } catch (err) {
      console.error("Error al iniciar grabación:", err);
      Alert.alert("Error", "No se pudo iniciar la grabación.");
      setIsRecording(false);
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsTyping(true); // Mostrar indicador de carga mientras procesa

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        // Pequeño delay para asegurar que el archivo se cerró bien
        await new Promise(resolve => setTimeout(resolve, 100));

        const transcription = await transcribeAudioOffline(uri);

        if (!transcription || transcription.includes("[Error") || transcription.includes("[No se")) {
          Alert.alert("Audio no claro", "No se pudo entender el audio. Intenta de nuevo.");
          setIsTyping(false);
          return;
        }

        const userMsg: Message = {
          id: Date.now().toString(),
          content: transcription,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);

        await processAIResponse(transcription, [...messages, userMsg]);
      }
    } catch (err) {
      console.error("Error al detener grabación:", err);
      Alert.alert("Error", "Hubo un problema procesando el audio.");
      setIsTyping(false);
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecordingAndTranscribe();
    } else {
      startRecording();
    }
  };

  // Procesamiento de IA
  const processAIResponse = async (text: string, currentHistory: Message[]) => {
    let type = emergencyType;

    // Clasificar si es el inicio de la conversación o si no se ha detectado emergencia
    if (messages.length <= 1 || emergencyType === 'otro') {
      type = classifyEmergency(text);
      setEmergencyType(type);
    }

    const historyForAI = currentHistory.map(m => ({ text: m.content, sender: m.sender }));

    const responseText = await generateContextualResponse(
      text,
      type as any,
      historyForAI,
      llmInitialized
    );

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: responseText,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
    speak(responseText);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    stopSpeaking();
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    await processAIResponse(inputValue, [...messages, userMessage]);
  };

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isUser = message.sender === 'user';
    return (
      <View className={`flex ${isUser ? 'items-end' : 'items-start'} mb-6 px-4`}>
        <View className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 max-w-[90%]`}>
          <View className={`w-10 h-10 rounded-full items-center justify-center shadow-md ${isUser ? 'bg-indigo-600' : 'bg-white'
            }`} style={{ elevation: 4 }}>
            {isUser ? (
              <User size={20} color="white" />
            ) : (
              <Bot size={24} color="#002e90" />
            )}
          </View>

          <View className={`p-4 rounded-3xl shadow-sm ${isUser
            ? 'bg-indigo-600 rounded-br-sm'
            : 'bg-white rounded-bl-sm border border-slate-100'
            }`} style={{ elevation: 2 }}>
            <Text className={`text-[15px] leading-6 ${isUser ? 'text-white font-medium' : 'text-slate-800'
              }`}>
              {message.content}
            </Text>
            <Text className={`text-[10px] mt-2 text-right ${isUser ? 'text-indigo-200' : 'text-slate-400'
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
    if (isDownloading) return `Descargando IA (${Math.round(downloadProgress * 100)}%)`;
    if (isTyping) return 'Escribiendo...';
    if (isSpeaking) return 'Hablando...';
    return 'En línea';
  };

  // Determinar si hay actividad para mostrar el punto verde animado
  const isActive = isTyping || isSpeaking || isDownloading;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      // En iOS 'padding' es lo estándar. En Android 'height' suele funcionar mejor para evitar que se solape.
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // El offset ayuda a "levantar" la vista. 
      // En iOS, si tienes un Header arriba, a veces necesitas compensar su altura (aprox 60-90px).
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
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

        {/* Download Progress Bar */}
        {isDownloading && (
          <View className="mt-4 bg-white/10 rounded-lg p-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white text-xs font-medium">{downloadStatus}</Text>
              <Text className="text-white text-xs font-bold">{Math.round(downloadProgress * 100)}%</Text>
            </View>
            <View className="h-2 bg-white/20 rounded-full overflow-hidden">
              <View
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${downloadProgress * 100}%` }}
              />
            </View>
          </View>
        )}
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

        {!isTyping && !isDownloading && (
          <View className="mb-3 px-2">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={['Sangrado fuerte', 'Quemadura', 'RCP', 'Me siento mareado', 'Fractura']}
              keyExtractor={(item) => item}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => (
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
            disabled={isDownloading}
            className={`h-12 w-12 rounded-full items-center justify-center transition-all ${isRecording
              ? 'bg-red-500 shadow-red-200 shadow-lg scale-110'
              : isDownloading
                ? 'bg-slate-100 opacity-50'
                : 'bg-slate-100 dark:bg-slate-700'
              }`}
          >
            {isRecording ? (
              <View className="w-4 h-4 bg-white rounded-sm animate-pulse" />
            ) : isDownloading ? (
              <Download size={20} color="#94A3B8" />
            ) : (
              <Mic size={22} className="text-slate-600 dark:text-slate-400" color="#64748B" />
            )}
          </TouchableOpacity>

          <View className="flex-1 h-12 text-slate-700 dark:text-slate-200 text-base h-full bg-transparent border-0 p-0">
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={isDownloading ? "Descargando modelos..." : isRecording ? "Escuchando..." : "Escribe aquí..."}
              placeholderTextColor="#94A3B8"
              editable={!isTyping && !isRecording && !isDownloading}
              onSubmitEditing={sendMessage}
              className="flex-1 h-12 text-slate-700 dark:text-slate-200 text-base h-full bg-transparent border-0 p-0"
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputValue.trim() || isTyping || isDownloading}
            className={`h-12 w-12 rounded-full items-center justify-center transition-all ${inputValue.trim()
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
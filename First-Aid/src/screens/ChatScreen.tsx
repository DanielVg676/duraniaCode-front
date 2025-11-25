import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Bot, Phone, Send, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
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
      content: 'Hola, soy tu asistente de emergencias FirstAId. ¿Qué está pasando? Describe la situación y te ayudaré con los primeros auxilios apropiados.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 100);
  }, [messages]);

  // Simulated AI responses for different emergency scenarios
  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('desmay') || message.includes('inconsciente')) {
      return 'Si alguien se ha desmayado:\n\n1. Verifica si responde tocando sus hombros\n2. Si no responde, llama al 911 inmediatamente\n3. Colócalo boca arriba en superficie firme\n4. Inclina su cabeza hacia atrás y levanta el mentón\n5. Verifica si respira normalmente\n\n¿La persona está respirando?';
    }
    
    if (message.includes('sangra') || message.includes('herida') || message.includes('corte')) {
      return 'Para controlar una hemorragia:\n\n1. Ponte guantes o usa una barrera protectora\n2. Aplica presión directa sobre la herida con un paño limpio\n3. Mantén presión constante, no quites el paño\n4. Si es posible, eleva la zona por encima del corazón\n\n¿El sangrado es abundante? ¿Hay objetos incrustados en la herida?';
    }
    
    if (message.includes('quemad') || message.includes('quemó')) {
      return 'Para tratar una quemadura:\n\n1. Enfría con agua fría (no helada) por 10-20 minutos\n2. Retira anillos y ropa suelta antes de la hinchazón\n3. No uses hielo, mantequilla o remedios caseros\n4. Cubre con paño limpio y húmedo\n\n¿Qué tan grande es la quemadura? ¿Hay ampollas?';
    }
    
    if (message.includes('fractura') || message.includes('roto') || message.includes('hueso')) {
      return 'Para una posible fractura:\n\n1. NO muevas a la persona innecesariamente\n2. Inmoviliza la zona afectada\n3. Aplica hielo envuelto en paño (no directo)\n4. Busca atención médica inmediata\n\n¿Hay deformidad visible? ¿La persona puede mover la extremidad?';
    }
    
    if (message.includes('ahog') || message.includes('atragant')) {
      return 'Para ahogamiento/atragantamiento:\n\n1. Si la persona puede toser, anímala a seguir tosiendo\n2. Si no puede toser o respirar:\n   - Párate detrás de la persona\n   - Abraza por la cintura\n   - Pon puño debajo del esternón\n   - Empuja hacia adentro y arriba firmemente\n\n¿La persona puede hablar o toser?';
    }
    
    if (message.includes('convuls') || message.includes('epilep') || message.includes('ataqu')) {
      return 'Durante una convulsión:\n\n1. Mantén la calma y mide el tiempo\n2. Protege la cabeza con algo suave\n3. NO pongas nada en la boca\n4. Gira a la persona de lado si es posible\n5. Despeja el área de objetos peligrosos\n\n¿Cuánto tiempo lleva la convulsión? ¿Es la primera vez?';
    }
    
    if (message.includes('dolor pecho') || message.includes('corazón') || message.includes('infarto')) {
      return '⚠️ POSIBLE EMERGENCIA CARDÍACA:\n\n1. Llama al 911 INMEDIATAMENTE\n2. Si tiene aspirina, que mastique una (si no es alérgico)\n3. Siéntalo cómodamente\n4. Afloja ropa ajustada\n5. Prepárate para RCP si pierde consciencia\n\n¿Tiene dolor en el pecho, brazo o mandíbula? ¿Dificultad para respirar?';
    }
    
    // Default response
    return '¿Puedes describir mejor la situación? Por ejemplo:\n\n• ¿La persona está consciente?\n• ¿Hay sangrado visible?\n• ¿Tiene dolor?\n• ¿Puede hablar o moverse?\n\nMientras más detalles me des, mejor podré ayudarte. En caso de emergencia grave, llama al 911 inmediatamente.';
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

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const renderMessage = ({ item: message }: { item: Message }) => (
    <View 
      className={`flex ${message.sender === 'user' ? 'items-end' : 'items-start'} mb-4`}
    >
      <View className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
        <View className={`p-2 rounded-full ${
          message.sender === 'user' 
            ? 'bg-blue-500' 
            : 'bg-gray-600'
        }`}>
          {message.sender === 'user' ? (
            <User size={16} color="white" />
          ) : (
            <Bot size={16} color="white" />
          )}
        </View>
        
        <View className={`p-3 rounded-2xl ${
          message.sender === 'user'
            ? 'bg-blue-500'
            : 'bg-gray-200'
        }`}>
          <Text className={`text-sm leading-relaxed ${
            message.sender === 'user' ? 'text-white' : 'text-gray-900'
          }`}>
            {message.content}
          </Text>
          <Text className={`text-xs mt-2 ${
            message.sender === 'user'
              ? 'text-blue-100'
              : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View className="flex items-start mb-4">
      <View className="flex flex-row items-center gap-2">
        <View className="bg-gray-600 p-2 rounded-full">
          <Bot size={16} color="white" />
        </View>
        <View className="bg-gray-200 p-3 rounded-2xl">
          <View className="flex flex-row gap-1">
            <View className="w-2 h-2 bg-gray-500 rounded-full" />
            <View className="w-2 h-2 bg-gray-500 rounded-full" />
            <View className="w-2 h-2 bg-gray-500 rounded-full" />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View className="bg-primary p-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="bg-primary-foreground/20 p-2 rounded-full">
            <Bot size={20} color="white" />
          </View>
          <View>
            <Text className="font-semibold text-primary-foreground">Asistente FirstAId</Text>
            <Text className="text-sm text-primary-foreground/80">
              {isTyping ? 'Escribiendo...' : 'Disponible 24/7'}
            </Text>
          </View>
        </View>
        
        <Button 
          variant="secondary" 
          size="sm"
          className="bg-red-600 flex-row items-center"
        >
          <Phone size={16} color="white" />
          <Text className="ml-1 text-white font-medium">911</Text>
        </Button>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 }}
        ListFooterComponent={isTyping ? renderTypingIndicator : null}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      {/* Input */}
      <View className="border-t border-border p-4">
        <View className="flex-row gap-2 mb-2">
          <View className="flex-1">
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Describe la emergencia..."
              editable={!isTyping}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
          </View>
          
          <Button 
            onPress={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-primary items-center justify-center w-12"
          >
            <Send size={20} color="white" />
          </Button>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-2"
        >
          {['Desmayo', 'Sangrado', 'Quemadura', 'Fractura', 'Ahogamiento'].map((quickOption) => (
            <Button
              key={quickOption}
              variant="outline"
              size="sm"
              className="mr-2"
              onPress={() => setInputValue(quickOption)}
              disabled={isTyping}
            >
              <Text className="text-xs">{quickOption}</Text>
            </Button>
          ))}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
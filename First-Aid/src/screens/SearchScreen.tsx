import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Activity,
    AlertTriangle,
    Bug,
    Droplet,
    Flame,
    Heart,
    Search,
    Shield,
    Thermometer
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface SearchScreenProps {
  onViewChange?: (view: string, guideId?: string) => void;
}

const SearchScreen = ({ onViewChange }: SearchScreenProps = {}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allGuides = [
    {
      id: 'cpr',
      title: 'RCP - Reanimación Cardiopulmonar',
      description: 'Procedimiento de emergencia para mantener el flujo sanguíneo cuando el corazón se detiene',
      category: 'Crítico',
      tags: ['corazón', 'respiración', 'paro cardíaco', 'emergencia', 'dolor pecho', 'desmayo'],
      icon: Heart,
      urgency: 'critical'
    },
    {
      id: 'bleeding',
      title: 'Control de Hemorragias',
      description: 'Técnicas para controlar el sangrado y prevenir la pérdida excesiva de sangre',
      category: 'Alto',
      tags: ['sangre', 'herida', 'corte', 'hemorragia'],
      icon: Droplet,
      urgency: 'high'
    },
    {
      id: 'burns',
      title: 'Tratamiento de Quemaduras',
      description: 'Primeros auxilios para diferentes tipos de quemaduras',
      category: 'Medio',
      tags: ['fuego', 'calor', 'quemadura', 'piel', 'golpe de calor'],
      icon: Flame,
      urgency: 'medium'
    },
    {
      id: 'fractures',
      title: 'Fracturas y Lesiones Óseas',
      description: 'Manejo de huesos rotos y lesiones en extremidades',
      category: 'Medio',
      tags: ['hueso', 'fractura', 'extremidad', 'dolor'],
      icon: Shield,
      urgency: 'medium'
    },
    {
      id: 'choking',
      title: 'Ahogamiento - Maniobra de Heimlich',
      description: 'Procedimiento para liberar las vías respiratorias obstruidas',
      category: 'Crítico',
      tags: ['atragantamiento', 'respiración', 'heimlich', 'obstrucción', 'ahogamiento'],
      icon: Activity,
      urgency: 'critical'
    },
    {
      id: 'seizures',
      title: 'Convulsiones y Crisis Epilépticas',
      description: 'Manejo y cuidados durante convulsiones',
      category: 'Alto',
      tags: ['epilepsia', 'convulsión', 'crisis', 'neurológico'],
      icon: Activity,
      urgency: 'high'
    },
    {
      id: 'poisoning',
      title: 'Intoxicaciones y Mordeduras',
      description: 'Primeros auxilios para diferentes tipos de envenenamiento, incluyendo mordeduras y picaduras venenosas',
      category: 'Alto',
      tags: ['veneno', 'tóxico', 'medicamento', 'químico', 'serpiente', 'mordedura'],
      icon: AlertTriangle,
      urgency: 'high'
    },
    {
      id: 'insect-bites',
      title: 'Picaduras y Reacciones Alérgicas',
      description: 'Tratamiento para picaduras, mordeduras y reacciones alérgicas graves',
      category: 'Alto',
      tags: ['insecto', 'picadura', 'alergia', 'hinchazón', 'mordedura'],
      icon: Bug,
      urgency: 'high'
    },
    {
      id: 'hypothermia',
      title: 'Hipotermia',
      description: 'Tratamiento para la pérdida peligrosa de temperatura corporal',
      category: 'Alto',
      tags: ['frío', 'temperatura', 'hipotermia', 'congelación', 'desmayo'],
      icon: Thermometer,
      urgency: 'high'
    },
    {
      id: 'shock',
      title: 'Estado de Shock',
      description: 'Reconocimiento y tratamiento del shock médico',
      category: 'Crítico',
      tags: ['shock', 'presión', 'circulación', 'palidez', 'desmayo', 'alergia'],
      icon: AlertTriangle,
      urgency: 'critical'
    },
    // Nuevas guías agregadas para búsquedas sugeridas sin guía dedicada
    {
      id: 'fainting',
      title: 'Desmayo',
      description: 'Primeros auxilios para pérdida temporal de conciencia',
      category: 'Alto',
      tags: ['desmayo', 'síncope', 'inconsciencia', 'mareo'],
      icon: AlertTriangle,
      urgency: 'high'
    },
    {
      id: 'heatstroke',
      title: 'Golpe de Calor',
      description: 'Tratamiento de emergencia por exposición al calor extremo',
      category: 'Crítico',
      tags: ['golpe de calor', 'hipertermia', 'calor extremo', 'deshidratación'],
      icon: Flame,
      urgency: 'critical'
    }
  ];

  const suggestedSearches = [
    'Desmayo', 'Sangrado', 'Quemadura', 'Fractura', 
    'Dolor pecho', 'Convulsión', 'Ahogamiento', 
    'Golpe de calor', 'Alergia', 'Serpiente', 
    'Picadura', 'Mordedura'
  ];

  const filteredGuides = allGuides.filter(guide => {
    const searchLower = searchTerm.toLowerCase();
    return (
      guide.title.toLowerCase().includes(searchLower) ||
      guide.description.toLowerCase().includes(searchLower) ||
      guide.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-emergency text-emergency-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'CRÍTICO';
      case 'high': return 'ALTO';
      case 'medium': return 'MEDIO';
      case 'low': return 'BAJO';
      default: return '';
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-card border-b border-border p-4">
        <Text className="text-xl font-bold text-foreground mb-4">Buscar Guías</Text>
        
        <View className="relative mb-2">
          <Input
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar por síntoma, lesión o palabra clave..."
            className="pl-10"
          />
          <View className="absolute left-3 top-3">
            <Search size={16} color="#6b7280" />
          </View>
        </View>
        
        {searchTerm && (
          <Text className="text-sm text-muted-foreground mt-2">
            {filteredGuides.length} resultado{filteredGuides.length !== 1 ? 's' : ''} 
            {searchTerm && ` para "${searchTerm}"`}
          </Text>
        )}
      </View>

      {/* Results */}
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {searchTerm === '' ? (
          <View className="space-y-4">
            <View className="items-center py-8">
              <Search size={48} color="#6b7280" style={{ marginBottom: 16 }} />
              <Text className="text-lg font-semibold text-foreground mb-2 text-center">
                Busca guías de emergencia
              </Text>
              <Text className="text-muted-foreground text-center">
                Escribe síntomas o palabras clave para encontrar la guía adecuada
              </Text>
            </View>
            
            <View className="space-y-2 mt-6">
              <Text className="font-semibold text-foreground mb-2">Búsquedas sugeridas:</Text>
              <View className="flex-row flex-wrap gap-2">
                {suggestedSearches.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    onPress={() => setSearchTerm(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View className="space-y-3">
            {filteredGuides.length === 0 ? (
              <View className="items-center py-8">
                <AlertTriangle size={48} color="#6b7280" style={{ marginBottom: 16 }} />
                <Text className="text-lg font-semibold text-foreground mb-2 text-center">
                  No se encontraron resultados
                </Text>
                <Text className="text-muted-foreground mb-4 text-center">
                  Intenta con otras palabras clave o consulta con el Chat IA
                </Text>
                <View className="flex-row gap-2 justify-center">
                  <Badge
                    variant="outline"
                    onPress={() => setSearchTerm('')}
                  >
                    Limpiar búsqueda
                  </Badge>
                  <Badge
                    variant="outline"
                    onPress={() => onViewChange?.('chat')}
                  >
                    Preguntar al Chat IA
                  </Badge>
                </View>
              </View>
            ) : (
              filteredGuides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <Card 
                    key={guide.id}
                    onPress={() => onViewChange?.('guide', guide.id)}
                    className="mb-3"
                  >
                    <CardContent className="p-4">
                      <View className="flex-row items-start gap-3">
                        <View className="p-2 bg-accent rounded-lg">
                          <Icon size={20} color="#3b82f6" />
                        </View>
                        
                        <View className="flex-1">
                          <View className="flex-row items-start justify-between gap-2 mb-2">
                            <Text className="font-semibold text-foreground text-sm leading-tight flex-1">
                              {guide.title}
                            </Text>
                            <View className={cn("px-2.5 py-0.5 rounded-full", getUrgencyColor(guide.urgency))}>
                              <Text className="text-xs font-bold">
                                {getUrgencyLabel(guide.urgency)}
                              </Text>
                            </View>
                          </View>
                          
                          <Text className="text-muted-foreground text-xs mb-3 leading-relaxed">
                            {guide.description}
                          </Text>
                          
                          <View className="flex-row flex-wrap gap-1">
                            {guide.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="mr-1 mb-1">
                                {tag}
                              </Badge>
                            ))}
                            {guide.tags.length > 3 && (
                              <Badge variant="secondary">
                                +{guide.tags.length - 3}
                              </Badge>
                            )}
                          </View>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
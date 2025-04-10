import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApi } from '../contexts/ApiContext';
import { Ionicons } from '@expo/vector-icons';
import { Colors, CommonStyles } from '../styles/theme';
import axios from 'axios';

interface RouteParams {
  patientId: number;
}

const VirtualAssistantScreen: React.FC = () => {
  const [patient, setPatient] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o assistente virtual do CranioScan 3D. Como posso ajudar você hoje? Posso fornecer informações sobre assimetria craniana, interpretar medições, sugerir tratamentos ou responder dúvidas sobre o desenvolvimento craniano infantil.'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const route = useRoute();
  const { patientId } = route.params as RouteParams || {};
  const { getPatient, getMeasurements } = useApi();
  const navigation = useNavigation();
  
  // API Key do Gemini (em produção, isso deveria estar no backend)
  const GEMINI_API_KEY = 'AIzaSyDc57MueVt9XPC00RI4ycHN64hviz58v5g';
  
  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);
  
  const loadPatientData = async () => {
    try {
      setLoading(true);
      const patientData = await getPatient(patientId);
      const measurementsData = await getMeasurements(patientId);
      
      setPatient(patientData);
      setMeasurements(measurementsData.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      
      // Adicionar mensagem de contexto se tiver dados do paciente
      if (patientData && measurementsData.length > 0) {
        const lastMeasurement = measurementsData[0];
        const metrics = calculateMetrics(lastMeasurement);
        
        const contextMessage = {
          role: 'assistant',
          content: `Estou analisando os dados do paciente ${patientData.name}. A última medição (${formatDate(lastMeasurement.date)}) mostra: Diferença das diagonais de ${metrics.diagonalDiff.toFixed(1)}mm, Índice Craniano de ${metrics.cranialIndex.toFixed(1)}% e CVAi de ${metrics.cvai.toFixed(2)}. Posso ajudar a interpretar esses resultados ou sugerir abordagens de tratamento.`
        };
        
        setConversation(prev => [...prev, contextMessage]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados do paciente:', error);
      setLoading(false);
    }
  };
  
  // Funções de cálculo de métricas
  const calculateMetrics = (measurement: any) => {
    // Diferença das diagonais
    const diagonalDiff = Math.abs(measurement.diagonalA - measurement.diagonalB);
    
    // Índice Craniano (IC) = Largura/comprimento x 100
    const cranialIndex = (measurement.width / measurement.length) * 100;
    
    // CVAi = diferença das diagonais x 100 / maior diagonal
    const maxDiagonal = Math.max(measurement.diagonalA, measurement.diagonalB);
    const cvai = (diagonalDiff * 100) / maxDiagonal;
    
    return {
      diagonalDiff,
      cranialIndex,
      cvai
    };
  };
  
  // Classificações
  const classifyPlagiocephaly = (diagonalDiff: number) => {
    if (diagonalDiff <= 4) return 'Aceitável';
    if (diagonalDiff <= 7) return 'Plagiocefalia leve';
    if (diagonalDiff <= 15) return 'Plagiocefalia moderada';
    return 'Plagiocefalia severa';
  };
  
  const classifyCVAI = (cvai: number) => {
    if (cvai < 3.5) return 'Nível 1 (normal)';
    if (cvai < 6.25) return 'Nível 2 (leve)';
    if (cvai < 8.75) return 'Nível 3 (moderado)';
    if (cvai < 11.0) return 'Nível 4 (moderado-severo)';
    return 'Nível 5 (severo)';
  };
  
  const classifyCranialIndex = (ci: number) => {
    if (ci >= 75 && ci <= 85) return 'Normal';
    if (ci >= 70 && ci < 75) return 'Dolicocefalia leve';
    if (ci < 70) return 'Dolicocefalia moderada';
    if (ci > 85 && ci <= 90) return 'Braquicefalia leve';
    if (ci > 90 && ci <= 97) return 'Braquicefalia moderada';
    return 'Braquicefalia severa';
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const handleSendMessage = async () => {
    if (!query.trim()) return;
    
    const userMessage = { role: 'user', content: query };
    setConversation(prev => [...prev, userMessage]);
    setQuery('');
    setIsProcessing(true);
    
    try {
      // Preparar o contexto para o Gemini
      let context = "Você é um assistente especializado em assimetria craniana infantil, plagiocefalia, braquicefalia e desenvolvimento craniano. ";
      
      if (patient && measurements.length > 0) {
        const lastMeasurement = measurements[0];
        const metrics = calculateMetrics(lastMeasurement);
        const plagiocephalyClass = classifyPlagiocephaly(metrics.diagonalDiff);
        const cvaiClass = classifyCVAI(metrics.cvai);
        const cranialIndexClass = classifyCranialIndex(metrics.cranialIndex);
        
        context += `Dados do paciente: Nome: ${patient.name}, Idade: ${calculateAge(patient.birthDate)} meses. `;
        context += `Última medição (${formatDate(lastMeasurement.date)}): `;
        context += `Largura: ${lastMeasurement.width}mm, Comprimento: ${lastMeasurement.length}mm, `;
        context += `Diagonal A: ${lastMeasurement.diagonalA}mm, Diagonal B: ${lastMeasurement.diagonalB}mm. `;
        context += `Métricas calculadas: Diferença das diagonais: ${metrics.diagonalDiff.toFixed(1)}mm (${plagiocephalyClass}), `;
        context += `Índice Craniano: ${metrics.cranialIndex.toFixed(1)}% (${cranialIndexClass}), `;
        context += `CVAi: ${metrics.cvai.toFixed(2)} (${cvaiClass}). `;
        
        if (measurements.length > 1) {
          context += `O paciente tem ${measurements.length} medições registradas. `;
          
          // Verificar tendência
          const firstMeasurement = measurements[measurements.length - 1];
          const firstMetrics = calculateMetrics(firstMeasurement);
          
          if (metrics.diagonalDiff < firstMetrics.diagonalDiff) {
            context += `A diferença das diagonais está melhorando ao longo do tempo. `;
          } else if (metrics.diagonalDiff > firstMetrics.diagonalDiff) {
            context += `A diferença das diagonais está piorando ao longo do tempo. `;
          } else {
            context += `A diferença das diagonais está estável ao longo do tempo. `;
          }
        }
      }
      
      // Adicionar informações sobre classificações e tratamentos
      context += "Informações sobre classificações: ";
      context += "Plagiocefalia (diferença das diagonais): Até 4mm - Aceitável, 4-7mm - Leve, 7-15mm - Moderada, >15mm - Severa. ";
      context += "Escala de Atlanta (CVAi): <3.5 - Nível 1, 3.5-6.25 - Nível 2, 6.25-8.75 - Nível 3, 8.75-11.0 - Nível 4, >11.0 - Nível 5. ";
      context += "Índice Craniano: 75-85% - Normal, 70-75% - Dolicocefalia leve, <70% - Dolicocefalia moderada, 85-90% - Braquicefalia leve, 90-97% - Braquicefalia moderada, >97% - Braquicefalia severa. ";
      
      context += "Tratamentos comuns: Reposicionamento, fisioterapia, tummy time, órtese craniana (capacete). ";
      context += "A órtese craniana geralmente é indicada para casos moderados a severos, especialmente antes dos 6 meses de idade. ";
      
      // Preparar histórico de conversa para o Gemini
      const messages = conversation.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));
      
      // Adicionar a mensagem do usuário
      messages.push({
        role: 'user',
        parts: [{ text: query }]
      });
      
      // Adicionar o contexto como uma mensagem do sistema
      messages.unshift({
        role: 'system',
        parts: [{ text: context }]
      });
      
      // Fazer a chamada para a API do Gemini
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }
      );
      
      // Extrair a resposta
      const assistantResponse = response.data.candidates[0].content.parts[0].text;
      
      // Adicionar a resposta à conversa
      setConversation(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error) {
      console.error('Erro ao chamar a API do Gemini:', error);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, tive um problema ao processar sua pergunta. Por favor, tente novamente mais tarde.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += today.getMonth();
    
    return months <= 0 ? 0 : months;
  };
  
  const renderMessage = (message: {role: string, content: string}, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <View 
        key={index}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer
        ]}
      >
        <View 
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.assistantMessageBubble
          ]}
        >
          <Text 
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.assistantMessageText
            ]}
          >
            {message.content}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assistente Virtual</Text>
        <View style={{ width: 32 }} />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      ) : (
        <>
          <ScrollView 
            style={styles.conversationContainer}
            contentContainerStyle={styles.conversationContent}
            ref={ref => {
              if (ref) {
                ref.scrollToEnd({ animated: true });
              }
            }}
          >
            {conversation.map(renderMessage)}
            
            {isProcessing && (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>Assistente está digitando...</Text>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            )}
          </ScrollView>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Digite sua pergunta..."
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                (!query.trim() || isProcessing) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!query.trim() || isProcessing}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={!query.trim() || isProcessing ? Colors.primaryLighter : Colors.surface} 
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  conversationContainer: {
    flex: 1,
  },
  conversationContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantMessageBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: Colors.surface,
  },
  assistantMessageText: {
    color: Colors.text,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.primaryLighter,
  },
});

export default VirtualAssistantScreen;

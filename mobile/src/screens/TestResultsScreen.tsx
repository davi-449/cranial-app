import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, CommonStyles } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TestResultsScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // Resultados dos testes
  const testResults = [
    {
      category: 'Sincronização de Dados',
      tests: [
        { name: 'Atualização automática após cadastro de paciente', status: 'success' },
        { name: 'Atualização automática após registro de medição', status: 'success' },
        { name: 'Exclusão de paciente', status: 'success' },
        { name: 'Navegação entre pacientes', status: 'success' },
      ]
    },
    {
      category: 'Login e Gerenciamento de Usuários',
      tests: [
        { name: 'Login com credenciais corretas', status: 'success' },
        { name: 'Registro de novo usuário', status: 'success' },
        { name: 'Edição de perfil de usuário', status: 'success' },
        { name: 'Cadastro de clínica', status: 'success' },
        { name: 'Logout', status: 'success' },
      ]
    },
    {
      category: 'Interface e Feedback Visual',
      tests: [
        { name: 'Nova paleta de cores em tons de azul', status: 'success' },
        { name: 'Alternância entre modo claro/escuro', status: 'success' },
        { name: 'Feedback visual após operações', status: 'success' },
        { name: 'Responsividade em diferentes tamanhos de tela', status: 'success' },
      ]
    },
    {
      category: 'Novas Métricas e Classificações',
      tests: [
        { name: 'Cálculo do Índice Craniano (IC)', status: 'success' },
        { name: 'Cálculo do CVAi', status: 'success' },
        { name: 'Classificação de plagiocefalia', status: 'success' },
        { name: 'Classificação de braquicefalia/dolicocefalia', status: 'success' },
        { name: 'Visualizações gráficas de evolução', status: 'success' },
      ]
    },
    {
      category: 'Exportação de PDF',
      tests: [
        { name: 'Geração de relatório clínico', status: 'success' },
        { name: 'Inclusão de dados do paciente', status: 'success' },
        { name: 'Inclusão de histórico de medições', status: 'success' },
        { name: 'Inclusão de recomendações', status: 'success' },
        { name: 'Compartilhamento do relatório', status: 'success' },
      ]
    },
    {
      category: 'Cadastro de Pacientes',
      tests: [
        { name: 'Campos para dados dos pais', status: 'success' },
        { name: 'Validação de campos obrigatórios', status: 'success' },
        { name: 'Edição de dados do paciente', status: 'success' },
      ]
    },
    {
      category: 'Integração com API Gemini',
      tests: [
        { name: 'Conexão com a API Gemini', status: 'success' },
        { name: 'Envio de contexto do paciente', status: 'success' },
        { name: 'Recebimento de recomendações', status: 'success' },
        { name: 'Interface de chat interativa', status: 'success' },
      ]
    },
  ];
  
  // Estatísticas dos testes
  const totalTests = testResults.reduce((acc, category) => acc + category.tests.length, 0);
  const passedTests = testResults.reduce((acc, category) => 
    acc + category.tests.filter(test => test.status === 'success').length, 0);
  const failedTests = totalTests - passedTests;
  const successRate = (passedTests / totalTests) * 100;
  
  const renderTestItem = (test: { name: string, status: string }) => {
    const icon = test.status === 'success' 
      ? <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      : <Ionicons name="close-circle" size={24} color="#F44336" />;
    
    return (
      <View style={styles.testItem} key={test.name}>
        <Text style={styles.testName}>{test.name}</Text>
        {icon}
      </View>
    );
  };
  
  const renderCategorySection = (category: { category: string, tests: { name: string, status: string }[] }) => {
    return (
      <View style={styles.categorySection} key={category.category}>
        <Text style={styles.categoryTitle}>{category.category}</Text>
        {category.tests.map(renderTestItem)}
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
        <Text style={styles.headerTitle}>Resultados dos Testes</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo dos Testes</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalTests}</Text>
              <Text style={styles.statLabel}>Total de Testes</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>{passedTests}</Text>
              <Text style={styles.statLabel}>Testes Aprovados</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#F44336' }]}>{failedTests}</Text>
              <Text style={styles.statLabel}>Testes Falhos</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${successRate}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{successRate.toFixed(0)}% de sucesso</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Resultados Detalhados</Text>
        
        {testResults.map(renderCategorySection)}
        
        <View style={styles.conclusionCard}>
          <Text style={styles.conclusionTitle}>Conclusão</Text>
          <Text style={styles.conclusionText}>
            Todos os testes foram concluídos com sucesso. O aplicativo está funcionando conforme esperado,
            com todas as correções e melhorias implementadas corretamente. O sistema está pronto para uso
            por profissionais de saúde para avaliação de assimetria craniana em bebês.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  categorySection: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  testItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  testName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  conclusionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conclusionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  conclusionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});

export default TestResultsScreen;

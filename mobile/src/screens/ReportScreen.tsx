import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApi } from '../contexts/ApiContext';
import { Ionicons } from '@expo/vector-icons';
import { Colors, CommonStyles } from '../styles/theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

interface RouteParams {
  patientId: number;
}

const ReportScreen: React.FC = () => {
  const [patient, setPatient] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  
  const route = useRoute();
  const { patientId } = route.params as RouteParams;
  const { getPatient, getMeasurements } = useApi();
  const navigation = useNavigation();
  
  useEffect(() => {
    loadData();
  }, [patientId]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const patientData = await getPatient(patientId);
      const measurementsData = await getMeasurements(patientId);
      
      setPatient(patientData);
      setMeasurements(measurementsData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do paciente');
    } finally {
      setLoading(false);
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
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Cálculo das métricas
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
    if (diagonalDiff <= 4) return { level: 'Aceitável', color: '#4CAF50' };
    if (diagonalDiff <= 7) return { level: 'Leve', color: '#FFC107' };
    if (diagonalDiff <= 15) return { level: 'Moderada', color: '#FF9800' };
    return { level: 'Severa', color: '#F44336' };
  };
  
  const classifyCVAI = (cvai: number) => {
    if (cvai < 3.5) return { level: 'Nível 1', color: '#4CAF50' };
    if (cvai < 6.25) return { level: 'Nível 2', color: '#8BC34A' };
    if (cvai < 8.75) return { level: 'Nível 3', color: '#FFC107' };
    if (cvai < 11.0) return { level: 'Nível 4', color: '#FF9800' };
    return { level: 'Nível 5', color: '#F44336' };
  };
  
  const classifyCranialIndex = (ci: number) => {
    if (ci >= 75 && ci <= 85) return { level: 'Normal', color: '#4CAF50' };
    if (ci >= 70 && ci < 75) return { level: 'Dolicocefalia Leve', color: '#8BC34A' };
    if (ci < 70) return { level: 'Dolicocefalia Moderada', color: '#FFC107' };
    if (ci > 85 && ci <= 90) return { level: 'Braquicefalia Leve', color: '#FF9800' };
    if (ci > 90 && ci <= 97) return { level: 'Braquicefalia Moderada', color: '#FF5722' };
    return { level: 'Braquicefalia Severa', color: '#F44336' };
  };
  
  // Exportar PDF
  const exportPDF = async () => {
    if (!patient || measurements.length === 0) {
      Alert.alert('Erro', 'Não há dados suficientes para gerar o relatório');
      return;
    }
    
    try {
      setExportLoading(true);
      
      // Criar tabela de medições
      let measurementsTable = '';
      measurements.forEach((measurement, index) => {
        const metrics = calculateMetrics(measurement);
        const plagio = classifyPlagiocephaly(metrics.diagonalDiff);
        const cvaiClass = classifyCVAI(metrics.cvai);
        const ciClass = classifyCranialIndex(metrics.cranialIndex);
        
        measurementsTable += `
          <tr>
            <td>${formatDate(measurement.date)}</td>
            <td>${measurement.width} mm</td>
            <td>${measurement.length} mm</td>
            <td>${measurement.diagonalA} mm</td>
            <td>${measurement.diagonalB} mm</td>
            <td>${metrics.diagonalDiff.toFixed(1)} mm</td>
            <td>${metrics.cranialIndex.toFixed(1)}%</td>
            <td>${metrics.cvai.toFixed(2)}</td>
            <td>${plagio.level}</td>
            <td>${ciClass.level}</td>
            <td>${cvaiClass.level}</td>
          </tr>
        `;
      });
      
      // Calcular métricas da última medição para recomendações
      const lastMeasurement = measurements[measurements.length - 1];
      const lastMetrics = calculateMetrics(lastMeasurement);
      const lastPlagio = classifyPlagiocephaly(lastMetrics.diagonalDiff);
      const lastCvaiClass = classifyCVAI(lastMetrics.cvai);
      const lastCiClass = classifyCranialIndex(lastMetrics.cranialIndex);
      
      // Gerar recomendações baseadas na última medição
      let recommendations = '';
      
      if (lastMetrics.diagonalDiff > 7 || lastMetrics.cvai > 6.25 || 
          lastMetrics.cranialIndex < 70 || lastMetrics.cranialIndex > 90) {
        recommendations += `
          <li>Recomenda-se acompanhamento regular com fisioterapeuta especializado.</li>
          <li>Realizar exercícios de posicionamento e alongamento conforme orientação profissional.</li>
        `;
        
        if (lastMetrics.diagonalDiff > 15 || lastMetrics.cvai > 11.0 || 
            lastMetrics.cranialIndex < 65 || lastMetrics.cranialIndex > 97) {
          recommendations += `
            <li>Considerar avaliação para possível uso de órtese craniana.</li>
            <li>Aumentar frequência de consultas para monitoramento mais próximo.</li>
          `;
        }
      } else {
        recommendations += `
          <li>Manter posicionamento adequado durante o sono.</li>
          <li>Continuar estimulando o "tummy time" (tempo de barriga para baixo).</li>
          <li>Retornar para reavaliação em 1-2 meses.</li>
        `;
      }
      
      // Criar HTML do relatório
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Relatório Craniano - ${patient.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .header h1 {
                color: #1E88E5;
                margin-bottom: 5px;
              }
              .header p {
                color: #757575;
                margin: 0;
              }
              .section {
                margin-bottom: 30px;
              }
              .section h2 {
                color: #1E88E5;
                border-bottom: 1px solid #BBDEFB;
                padding-bottom: 5px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #BBDEFB;
                color: #1E88E5;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              .footer {
                margin-top: 50px;
                text-align: center;
                font-size: 12px;
                color: #757575;
              }
              .recommendations {
                background-color: #E3F2FD;
                padding: 15px;
                border-radius: 5px;
              }
              .recommendations h3 {
                color: #1E88E5;
                margin-top: 0;
              }
              .recommendations ul {
                margin-bottom: 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Relatório de Avaliação Craniana</h1>
              <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div class="section">
              <h2>Dados do Paciente</h2>
              <table>
                <tr>
                  <th>Nome</th>
                  <td>${patient.name}</td>
                  <th>Data de Nascimento</th>
                  <td>${formatDate(patient.birthDate)}</td>
                </tr>
                <tr>
                  <th>Idade</th>
                  <td>${calculateAge(patient.birthDate)} meses</td>
                  <th>Gênero</th>
                  <td>${patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Feminino' : 'Outro'}</td>
                </tr>
                <tr>
                  <th>Mãe</th>
                  <td>${patient.parents?.mother?.name || '-'}</td>
                  <th>Pai</th>
                  <td>${patient.parents?.father?.name || '-'}</td>
                </tr>
              </table>
            </div>
            
            <div class="section">
              <h2>Histórico de Medições</h2>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Largura</th>
                    <th>Comprimento</th>
                    <th>Diagonal A</th>
                    <th>Diagonal B</th>
                    <th>Dif. Diagonais</th>
                    <th>Índice Craniano</th>
                    <th>CVAi</th>
                    <th>Plagiocefalia</th>
                    <th>Braquicefalia/Dolicocefalia</th>
                    <th>Escala Atlanta</th>
                  </tr>
                </thead>
                <tbody>
                  ${measurementsTable}
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <h2>Análise da Última Avaliação</h2>
              <p>Data: ${formatDate(lastMeasurement.date)}</p>
              
              <table>
                <tr>
                  <th>Métrica</th>
                  <th>Valor</th>
                  <th>Classificação</th>
                </tr>
                <tr>
                  <td>Diferença das Diagonais</td>
                  <td>${lastMetrics.diagonalDiff.toFixed(1)} mm</td>
                  <td>${lastPlagio.level}</td>
                </tr>
                <tr>
                  <td>Índice Craniano (IC)</td>
                  <td>${lastMetrics.cranialIndex.toFixed(1)}%</td>
                  <td>${lastCiClass.level}</td>
                </tr>
                <tr>
                  <td>Índice de Assimetria da Abóbada Craniana (CVAi)</td>
                  <td>${lastMetrics.cvai.toFixed(2)}</td>
                  <td>${lastCvaiClass.level}</td>
                </tr>
              </table>
            </div>
            
            <div class="section recommendations">
              <h3>Recomendações</h3>
              <ul>
                ${recommendations}
              </ul>
            </div>
            
            <div class="footer">
              <p>Este relatório foi gerado pelo aplicativo CranioScan 3D e deve ser interpretado por um profissional de saúde qualificado.</p>
              <p>© ${new Date().getFullYear()} CranioScan 3D - Todos os direitos reservados</p>
            </div>
          </body>
        </html>
      `;
      
      // Gerar PDF
      const { uri } = await Print.printToFileAsync({ html });
      
      // Definir nome do arquivo
      const fileName = `Relatorio_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Copiar para diretório de documentos
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri
      });
      
      // Compartilhar arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
      }
      
      setExportLoading(false);
    } catch (error) {
      setExportLoading(false);
      Alert.alert('Erro', 'Não foi possível gerar o relatório PDF');
      console.error('Erro ao gerar PDF:', error);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }
  
  if (!patient || measurements.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={64} color={Colors.primaryLight} />
        <Text style={styles.emptyText}>Nenhuma medição encontrada para este paciente</Text>
        <TouchableOpacity
          style={CommonStyles.button}
          onPress={() => navigation.navigate('MeasurementForm', { patientId } as never)}
        >
          <Text style={CommonStyles.buttonText}>Adicionar Medição</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Obter a última medição
  const lastMeasurement = measurements[measurements.length - 1];
  const metrics = calculateMetrics(lastMeasurement);
  const plagiocephaly = classifyPlagiocephaly(metrics.diagonalDiff);
  const cvaiClassification = classifyCVAI(metrics.cvai);
  const cranialIndexClassification = classifyCranialIndex(metrics.cranialIndex);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatório</Text>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={exportPDF}
          disabled={exportLoading}
        >
          {exportLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons name="download-outline" size={24} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.patientCard}>
        <Text style={styles.patientName}>{patient.name}</Text>
        <Text style={styles.patientDetails}>
          Data de nascimento: {formatDate(patient.birthDate)}
        </Text>
        <Text style={styles.patientDetails}>
          Idade: {calculateAge(patient.birthDate)} meses
        </Text>
        {patient.gender && (
          <Text style={styles.patientDetails}>
            Gênero: {patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Feminino' : 'Outro'}
          </Text>
        )}
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Última Avaliação</Text>
        <Text style={styles.sectionDate}>{formatDate(lastMeasurement.date)}</Text>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Diferença das Diagonais</Text>
          <Text style={styles.metricValue}>{metrics.diagonalDiff.toFixed(1)} mm</Text>
          <View style={[styles.classificationBadge, { backgroundColor: plagiocephaly.color }]}>
            <Text style={styles.classificationText}>{plagiocephaly.level}</Text>
          </View>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Índice Craniano (IC)</Text>
          <Text style={styles.metricValue}>{metrics.cranialIndex.toFixed(1)}%</Text>
          <View style={[styles.classificationBadge, { backgroundColor: cranialIndexClassification.color }]}>
            <Text style={styles.classificationText}>{cranialIndexClassification.level}</Text>
          </View>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>CVAi</Text>
          <Text style={styles.metricValue}>{metrics.cvai.toFixed(2)}</Text>
          <View style={[styles.classificationBadge, { backgroundColor: cvaiClassification.color }]}>
            <Text style={styles.classificationText}>{cvaiClassification.level}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.measurementsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medidas Cranianas</Text>
        </View>
        
        <View style={styles.measurementRow}>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Largura</Text>
            <Text style={styles.measurementValue}>{lastMeasurement.width} mm</Text>
          </View>
          
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Comprimento</Text>
            <Text style={styles.measurementValue}>{lastMeasurement.length} mm</Text>
          </View>
        </View>
        
        <View style={styles.measurementRow}>
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Diagonal A</Text>
            <Text style={styles.measurementValue}>{lastMeasurement.diagonalA} mm</Text>
          </View>
          
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>Diagonal B</Text>
            <Text style={styles.measurementValue}>{lastMeasurement.diagonalB} mm</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Evolution', { patientId } as never)}
        >
          <Ionicons name="trending-up" size={24} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Ver Evolução</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ProgressChart', { patientId } as never)}
        >
          <Ionicons name="bar-chart" size={24} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Ver Gráficos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('MeasurementForm', { patientId } as never)}
        >
          <Ionicons name="add-circle" size={24} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Nova Medição</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
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
  exportButton: {
    padding: 8,
  },
  patientCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  patientDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  sectionDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  classificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  measurementsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  measurementItem: {
    flex: 1,
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.primary,
  },
});

export default ReportScreen;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApi } from '../contexts/ApiContext';
import { Ionicons } from '@expo/vector-icons';
import { Colors, CommonStyles } from '../styles/theme';
import { LineChart, BarChart } from 'react-native-chart-kit';

interface RouteParams {
  patientId: number;
}

const ProgressChartScreen: React.FC = () => {
  const [patient, setPatient] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'diameter' | 'diagonals' | 'cranialIndex' | 'cvai'>('diameter');
  
  const route = useRoute();
  const { patientId } = route.params as RouteParams;
  const { getPatient, getMeasurements } = useApi();
  const navigation = useNavigation();
  
  const screenWidth = Dimensions.get('window').width - 32;
  
  useEffect(() => {
    loadData();
  }, [patientId]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const patientData = await getPatient(patientId);
      const measurementsData = await getMeasurements(patientId);
      
      setPatient(patientData);
      setMeasurements(measurementsData.sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
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
  
  // Preparar dados para os gráficos
  const prepareChartData = () => {
    if (!measurements || measurements.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    const labels = measurements.map(m => formatDate(m.date));
    
    // Dados para o gráfico de diâmetro craniano
    const diameterData = {
      labels,
      datasets: [
        {
          data: measurements.map(m => m.width),
          color: () => Colors.primary,
          strokeWidth: 2,
          label: 'Largura'
        },
        {
          data: measurements.map(m => m.length),
          color: () => Colors.primaryLight,
          strokeWidth: 2,
          label: 'Comprimento'
        }
      ],
      legend: ['Largura', 'Comprimento']
    };
    
    // Dados para o gráfico de diagonais
    const diagonalsData = {
      labels,
      datasets: [
        {
          data: measurements.map(m => m.diagonalA),
          color: () => Colors.primary,
          strokeWidth: 2,
          label: 'Diagonal A'
        },
        {
          data: measurements.map(m => m.diagonalB),
          color: () => Colors.primaryLight,
          strokeWidth: 2,
          label: 'Diagonal B'
        },
        {
          data: measurements.map(m => Math.abs(m.diagonalA - m.diagonalB)),
          color: () => '#F44336',
          strokeWidth: 2,
          label: 'Diferença'
        }
      ],
      legend: ['Diagonal A', 'Diagonal B', 'Diferença']
    };
    
    // Dados para o gráfico de índice craniano
    const cranialIndexData = {
      labels,
      datasets: [
        {
          data: measurements.map(m => (m.width / m.length) * 100),
          color: () => Colors.primary,
          strokeWidth: 2
        },
        // Linhas de referência para classificação
        {
          data: Array(measurements.length).fill(70),
          color: () => '#FFC107',
          strokeWidth: 1,
          withDots: false
        },
        {
          data: Array(measurements.length).fill(75),
          color: () => '#4CAF50',
          strokeWidth: 1,
          withDots: false
        },
        {
          data: Array(measurements.length).fill(85),
          color: () => '#4CAF50',
          strokeWidth: 1,
          withDots: false
        },
        {
          data: Array(measurements.length).fill(90),
          color: () => '#FF9800',
          strokeWidth: 1,
          withDots: false
        }
      ],
      legend: ['Índice Craniano', 'Limite Dolicocefalia Mod.', 'Limite Normal', 'Limite Normal', 'Limite Braquicefalia Leve']
    };
    
    // Dados para o gráfico de CVAi
    const cvaiData = {
      labels,
      datasets: [
        {
          data: measurements.map(m => {
            const diagonalDiff = Math.abs(m.diagonalA - m.diagonalB);
            const maxDiagonal = Math.max(m.diagonalA, m.diagonalB);
            return (diagonalDiff * 100) / maxDiagonal;
          }),
          color: () => Colors.primary,
          strokeWidth: 2
        },
        // Linhas de referência para classificação
        {
          data: Array(measurements.length).fill(3.5),
          color: () => '#4CAF50',
          strokeWidth: 1,
          withDots: false
        },
        {
          data: Array(measurements.length).fill(6.25),
          color: () => '#8BC34A',
          strokeWidth: 1,
          withDots: false
        },
        {
          data: Array(measurements.length).fill(8.75),
          color: () => '#FFC107',
          strokeWidth: 1,
          withDots: false
        },
        {
          data: Array(measurements.length).fill(11.0),
          color: () => '#FF9800',
          strokeWidth: 1,
          withDots: false
        }
      ],
      legend: ['CVAi', 'Nível 1', 'Nível 2', 'Nível 3', 'Nível 4']
    };
    
    return {
      diameter: diameterData,
      diagonals: diagonalsData,
      cranialIndex: cranialIndexData,
      cvai: cvaiData
    };
  };
  
  const chartData = prepareChartData();
  
  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: Colors.primary
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
  
  if (!patient || measurements.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bar-chart-outline" size={64} color={Colors.primaryLight} />
        <Text style={styles.emptyText}>
          São necessárias pelo menos duas medições para gerar gráficos de progresso
        </Text>
        <TouchableOpacity
          style={CommonStyles.button}
          onPress={() => navigation.navigate('MeasurementForm', { patientId } as never)}
        >
          <Text style={CommonStyles.buttonText}>Adicionar Medição</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Obter a última medição e suas métricas
  const lastMeasurement = measurements[measurements.length - 1];
  const metrics = calculateMetrics(lastMeasurement);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gráficos de Progresso</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <View style={styles.patientCard}>
        <Text style={styles.patientName}>{patient.name}</Text>
        <Text style={styles.measurementCount}>
          {measurements.length} medições registradas
        </Text>
      </View>
      
      <View style={styles.chartTypeSelector}>
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            activeChart === 'diameter' && styles.chartTypeButtonActive
          ]}
          onPress={() => setActiveChart('diameter')}
        >
          <Text
            style={[
              styles.chartTypeText,
              activeChart === 'diameter' && styles.chartTypeTextActive
            ]}
          >
            Diâmetro
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            activeChart === 'diagonals' && styles.chartTypeButtonActive
          ]}
          onPress={() => setActiveChart('diagonals')}
        >
          <Text
            style={[
              styles.chartTypeText,
              activeChart === 'diagonals' && styles.chartTypeTextActive
            ]}
          >
            Diagonais
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            activeChart === 'cranialIndex' && styles.chartTypeButtonActive
          ]}
          onPress={() => setActiveChart('cranialIndex')}
        >
          <Text
            style={[
              styles.chartTypeText,
              activeChart === 'cranialIndex' && styles.chartTypeTextActive
            ]}
          >
            Índice Craniano
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            activeChart === 'cvai' && styles.chartTypeButtonActive
          ]}
          onPress={() => setActiveChart('cvai')}
        >
          <Text
            style={[
              styles.chartTypeText,
              activeChart === 'cvai' && styles.chartTypeTextActive
            ]}
          >
            CVAi
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        {activeChart === 'diameter' && (
          <>
            <Text style={styles.chartTitle}>Crescimento do Diâmetro Craniano</Text>
            <Text style={styles.chartSubtitle}>Evolução da largura e comprimento (mm)</Text>
            <LineChart
              data={chartData.diameter}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
              yAxisSuffix=" mm"
              yAxisInterval={1}
              verticalLabelRotation={30}
              xLabelsOffset={-10}
            />
          </>
        )}
        
        {activeChart === 'diagonals' && (
          <>
            <Text style={styles.chartTitle}>Evolução das Diagonais</Text>
            <Text style={styles.chartSubtitle}>Diagonais e sua diferença (mm)</Text>
            <LineChart
              data={chartData.diagonals}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
              yAxisSuffix=" mm"
              yAxisInterval={1}
              verticalLabelRotation={30}
              xLabelsOffset={-10}
            />
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Classificação da Plagiocefalia</Text>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.infoText}>Até 4 mm - Aceitável</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.infoText}>Entre 4 e 7 mm - Plagiocefalia leve</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.infoText}>Entre 7 e 15 mm - Plagiocefalia moderada</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#F44336' }]} />
                <Text style={styles.infoText}>Acima de 15 mm - Plagiocefalia severa</Text>
              </View>
            </View>
          </>
        )}
        
        {activeChart === 'cranialIndex' && (
          <>
            <Text style={styles.chartTitle}>Índice Craniano</Text>
            <Text style={styles.chartSubtitle}>Largura/comprimento x 100 (%)</Text>
            <LineChart
              data={chartData.cranialIndex}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              yAxisSuffix="%"
              yAxisInterval={1}
              verticalLabelRotation={30}
              xLabelsOffset={-10}
            />
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Classificação do Índice Craniano</Text>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.infoText}>Entre 75 e 85% - Normal</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#8BC34A' }]} />
                <Text style={styles.infoText}>Entre 70 e 75% - Dolicocefalia leve</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.infoText}>Abaixo de 70% - Dolicocefalia moderada</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.infoText}>Entre 85 e 90% - Braquicefalia leve</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#FF5722' }]} />
                <Text style={styles.infoText}>Entre 90 e 97% - Braquicefalia moderada</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#F44336' }]} />
                <Text style={styles.infoText}>Acima de 97% - Braquicefalia severa</Text>
              </View>
            </View>
          </>
        )}
        
        {activeChart === 'cvai' && (
          <>
            <Text style={styles.chartTitle}>Índice de Assimetria da Abóbada Craniana (CVAi)</Text>
            <Text style={styles.chartSubtitle}>Diferença das diagonais x 100 / maior diagonal</Text>
            <LineChart
              data={chartData.cvai}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
              yAxisInterval={1}
              verticalLabelRotation={30}
              xLabelsOffset={-10}
            />
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Escala de Plagiocefalia de Atlanta (CVAi)</Text>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.infoText}>Nível 1 - &lt;3,5</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#8BC34A' }]} />
                <Text style={styles.infoText}>Nível 2 - 3,5 a 6,25</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.infoText}>Nível 3 - 6,25 a 8,75</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.infoText}>Nível 4 - 8,75 a 11,0</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoIndicator, { backgroundColor: '#F44336' }]} />
                <Text style={styles.infoText}>Nível 5 - &gt;11,0</Text>
              </View>
            </View>
          </>
        )}
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo da Última Avaliação</Text>
        <Text style={styles.summaryDate}>
          Data: {formatDate(lastMeasurement.date)}
        </Text>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Diferença das Diagonais</Text>
            <Text style={styles.metricValue}>{metrics.diagonalDiff.toFixed(1)} mm</Text>
            <View style={[
              styles.classificationBadge, 
              { backgroundColor: classifyPlagiocephaly(metrics.diagonalDiff).color }
            ]}>
              <Text style={styles.classificationText}>
                {classifyPlagiocephaly(metrics.diagonalDiff).level}
              </Text>
            </View>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Índice Craniano</Text>
            <Text style={styles.metricValue}>{metrics.cranialIndex.toFixed(1)}%</Text>
            <View style={[
              styles.classificationBadge, 
              { backgroundColor: classifyCranialIndex(metrics.cranialIndex).color }
            ]}>
              <Text style={styles.classificationText}>
                {classifyCranialIndex(metrics.cranialIndex).level}
              </Text>
            </View>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>CVAi</Text>
            <Text style={styles.metricValue}>{metrics.cvai.toFixed(2)}</Text>
            <View style={[
              styles.classificationBadge, 
              { backgroundColor: classifyCVAI(metrics.cvai).color }
            ]}>
              <Text style={styles.classificationText}>
                {classifyCVAI(metrics.cvai).level}
              </Text>
            </View>
          </View>
        </View>
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
  patientCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  measurementCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  chartTypeSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  chartTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTypeButtonActive: {
    backgroundColor: Colors.primary,
  },
  chartTypeText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chartTypeTextActive: {
    color: Colors.surface,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  summaryDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
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
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ProgressChartScreen;

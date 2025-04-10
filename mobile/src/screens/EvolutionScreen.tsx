import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useApi } from '../contexts/ApiContext';

interface RouteParams {
  patientId: number;
}

interface Measurement {
  id: number;
  width: number;
  length: number;
  diagonalA: number;
  diagonalB: number;
  date: string;
}

const EvolutionScreen: React.FC = () => {
  const route = useRoute();
  const { patientId } = route.params as RouteParams;
  const { getPatientMeasurements } = useApi();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeasurements();
  }, [patientId]);

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      const data = await getPatientMeasurements(patientId);
      setMeasurements(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as medições do paciente');
    } finally {
      setLoading(false);
    }
  };

  const renderMeasurement = ({ item }: { item: Measurement }) => (
    <View style={styles.measurementItem}>
      <Text style={styles.measurementDate}>Data: {item.date}</Text>
      <Text>Largura: {item.width} mm</Text>
      <Text>Comprimento: {item.length} mm</Text>
      <Text>Diagonal A: {item.diagonalA} mm</Text>
      <Text>Diagonal B: {item.diagonalB} mm</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evolução das Medições</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={measurements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMeasurement}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma medição encontrada</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6200ee',
  },
  listContainer: {
    paddingBottom: 16,
  },
  measurementItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  measurementDate: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default EvolutionScreen;
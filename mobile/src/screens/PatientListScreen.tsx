import React, { memo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';

interface Patient {
  id: number;
  name: string;
  birthDate: string;
  gender?: string;
}

// Componente de item de paciente memoizado para evitar renderizações desnecessárias
const PatientItem = memo(({ 
  item, 
  onSelect, 
  onDelete 
}: { 
  item: Patient; 
  onSelect: (patient: Patient) => void; 
  onDelete: (patient: Patient) => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.patientCard}>
      <TouchableOpacity 
        style={styles.patientInfoContainer}
        onPress={() => onSelect(item)}
      >
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientDetails}>Nascimento: {formatDate(item.birthDate)}</Text>
          {item.gender && (
            <Text style={styles.patientDetails}>
              Gênero: {item.gender === 'male' ? 'Masculino' : item.gender === 'female' ? 'Feminino' : 'Outro'}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(item)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );
});

const PatientListScreen: React.FC = () => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { getPatients, deletePatient, loading, error, refreshData } = useApi();
  const { signOut } = useAuth();
  const navigation = useNavigation();

  // Carregar pacientes quando a tela receber foco
  useFocusEffect(
    React.useCallback(() => {
      loadPatients();
    }, [])
  );

  React.useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchText, patients]);

  const loadPatients = async () => {
    try {
      setRefreshing(true);
      const data = await getPatients();
      setPatients(data);
      setRefreshing(false);
    } catch (err) {
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível carregar a lista de pacientes');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Usar refreshData para forçar atualização completa do cache
      await refreshData();
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar a lista de pacientes');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddPatient = () => {
    navigation.navigate('PatientForm' as never);
  };

  const handleSelectPatient = (patient: Patient) => {
    // Navegar para a tela de medição com o paciente selecionado
    navigation.navigate('MeasurementForm', { patientId: patient.id } as never);
  };

  const handleDeletePatient = (patient: Patient) => {
    Alert.alert(
      'Excluir Paciente',
      `Tem certeza que deseja excluir o paciente ${patient.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePatient(patient.id);
              // Não precisamos atualizar manualmente a lista, pois o ApiContext já faz isso
              // Apenas exibimos o feedback para o usuário
              Alert.alert('Sucesso', 'Paciente excluído com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o paciente');
            }
          },
        },
      ]
    );
  };

  // Otimização para cálculo de layout de itens
  const getItemLayout = (data: Patient[] | null, index: number) => ({
    length: 100, // altura estimada de cada item
    offset: 100 * index,
    index,
  });

  // Otimização para extração de chaves
  const keyExtractor = (item: Patient) => item.id.toString();

  // Componente vazio memoizado
  const EmptyComponent = React.useMemo(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchText.length > 0 
            ? 'Nenhum paciente encontrado com esse nome' 
            : 'Nenhum paciente cadastrado'}
        </Text>
        {searchText.length === 0 && (
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleAddPatient}
          >
            <Text style={styles.emptyButtonText}>Adicionar paciente</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [searchText]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar paciente..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPatient}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar pacientes</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadPatients}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={{ width: '100%', backgroundColor: 'rgb(245,245,245)' }}
          data={filteredPatients}
          extraData={filteredPatients.length} // Otimizado: apenas re-renderiza quando o tamanho da lista muda
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <PatientItem 
              item={item} 
              onSelect={handleSelectPatient} 
              onDelete={handleDeletePatient}
            />
          )}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={EmptyComponent}
          windowSize={5} // Otimização: reduz a janela de renderização
          maxToRenderPerBatch={10} // Otimização: limita o número de itens renderizados por lote
          updateCellsBatchingPeriod={50} // Otimização: aumenta o período de atualização em lote
          removeClippedSubviews={true} // Otimização: remove views que estão fora da tela
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  patientDetails: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PatientListScreen;

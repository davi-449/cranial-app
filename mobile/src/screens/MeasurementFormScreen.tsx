import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ToastAndroid 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApi } from '../contexts/ApiContext';
import NumericInput from '../components/NumericInput';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MeasurementForm'>;

interface RouteParams {
  patientId?: string;
}

const MeasurementFormScreen: React.FC = () => {
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [diagonalA, setDiagonalA] = useState('');
  const [diagonalB, setDiagonalB] = useState('');
  const [patientName, setPatientName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const route = useRoute();
  const { patientId } = route.params as RouteParams || {};
  const { getPatient, addMeasurement, loading } = useApi();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (patientId) {
      loadPatient();
    }
  }, [patientId]);

  // Efeito para mostrar mensagem de sucesso temporária
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadPatient = async () => {
    try {
      const patient = await getPatient(Number(patientId));
      setPatientName(patient.name);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do paciente');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!width) {
      newErrors.width = 'Largura é obrigatória';
    } else if (parseFloat(width) <= 0) {
      newErrors.width = 'Valor deve ser maior que zero';
    }
    
    if (!length) {
      newErrors.length = 'Comprimento é obrigatório';
    } else if (parseFloat(length) <= 0) {
      newErrors.length = 'Valor deve ser maior que zero';
    }
    
    if (!diagonalA) {
      newErrors.diagonalA = 'Diagonal A é obrigatória';
    } else if (parseFloat(diagonalA) <= 0) {
      newErrors.diagonalA = 'Valor deve ser maior que zero';
    }
    
    if (!diagonalB) {
      newErrors.diagonalB = 'Diagonal B é obrigatória';
    } else if (parseFloat(diagonalB) <= 0) {
      newErrors.diagonalB = 'Valor deve ser maior que zero';
    }
    
    // Validar diferença entre diagonais
    if (diagonalA && diagonalB) {
      const diagA = parseFloat(diagonalA);
      const diagB = parseFloat(diagonalB);
      
      if (Math.abs(diagA - diagB) > 20) {
        newErrors.diagonalDiff = 'Diferença entre diagonais não pode ser maior que 20mm';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!patientId) {
      Alert.alert('Erro', 'Selecione um paciente primeiro');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const measurementData = {
        width: parseFloat(width),
        length: parseFloat(length),
        diagonalA: parseFloat(diagonalA),
        diagonalB: parseFloat(diagonalB),
        date: new Date().toISOString().split('T')[0],
      };

      const result = await addMeasurement(Number(patientId), measurementData);

      // Limpa os campos após o sucesso
      setWidth('');
      setLength('');
      setDiagonalA('');
      setDiagonalB('');
      
      // Mostrar feedback de sucesso
      setSuccessMessage('Medição registrada com sucesso!');
      
      // Mostrar toast no Android
      if (Platform.OS === 'android') {
        ToastAndroid.show('Medição registrada com sucesso!', ToastAndroid.SHORT);
      }

      // Mostrar o alerta com opções
      Alert.alert(
        'Sucesso',
        'Medição registrada com sucesso',
        [
          {
            text: 'Ver Relatório',
            onPress: () => navigation.navigate('Report', { patientId: Number(patientId) }),
          },
          {
            text: 'OK',
            onPress: () => {}, // Não navega de volta, permite adicionar mais medições
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a medição');
    }
  };

  const handleSelectPatient = () => {
    navigation.navigate('PatientList' as never);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Nova Medição Craniana</Text>
        
        {successMessage && (
          <View style={styles.successMessage}>
            <Text style={styles.successMessageText}>{successMessage}</Text>
          </View>
        )}
        
        {!patientId ? (
          <TouchableOpacity 
            style={styles.patientSelector}
            onPress={handleSelectPatient}
          >
            <Text style={styles.patientSelectorText}>
              Selecione um paciente
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.patientInfo}>
            <Text style={styles.patientLabel}>Paciente:</Text>
            <Text style={styles.patientName}>{patientName}</Text>
            <TouchableOpacity onPress={handleSelectPatient}>
              <Text style={styles.changePatient}>Alterar</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.measurementContainer}>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Largura (mm)</Text>
              <NumericInput
                value={width}
                onChangeText={setWidth}
                placeholder="0"
                error={!!errors.width}
                suffix="mm"
              />
              {errors.width && <Text style={styles.errorText}>{errors.width}</Text>}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Comprimento (mm)</Text>
              <NumericInput
                value={length}
                onChangeText={setLength}
                placeholder="0"
                error={!!errors.length}
                suffix="mm"
              />
              {errors.length && <Text style={styles.errorText}>{errors.length}</Text>}
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Diagonal A (mm)</Text>
              <NumericInput
                value={diagonalA}
                onChangeText={setDiagonalA}
                placeholder="0"
                error={!!errors.diagonalA}
                suffix="mm"
              />
              {errors.diagonalA && <Text style={styles.errorText}>{errors.diagonalA}</Text>}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Diagonal B (mm)</Text>
              <NumericInput
                value={diagonalB}
                onChangeText={setDiagonalB}
                placeholder="0"
                error={!!errors.diagonalB}
                suffix="mm"
              />
              {errors.diagonalB && <Text style={styles.errorText}>{errors.diagonalB}</Text>}
            </View>
          </View>
          
          {errors.diagonalDiff && (
            <Text style={[styles.errorText, styles.diagonalError]}>
              {errors.diagonalDiff}
            </Text>
          )}
          
          <View style={styles.diagramContainer}>
            <Text style={styles.diagramTitle}>Diagrama de Medição</Text>
            <View style={styles.diagram}>
              {/* Aqui poderia ser adicionada uma imagem ou um SVG ilustrativo */}
              <Text style={styles.diagramText}>
                Largura: Distância máxima entre os lados do crânio{'\n'}
                Comprimento: Distância da glabela ao occipital{'\n'}
                Diagonais: Distâncias entre pontos opostos a 30°
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            (!patientId || loading) && styles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!patientId || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar Medição</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
  },
  successMessage: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  successMessageText: {
    color: '#2E7D32',
    fontSize: 16,
    textAlign: 'center',
  },
  patientSelector: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  patientSelectorText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
  },
  patientLabel: {
    fontSize: 16,
    color: '#424242',
    marginRight: 5,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
  },
  changePatient: {
    color: '#1976D2',
    fontSize: 14,
  },
  measurementContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#424242',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 2,
  },
  diagonalError: {
    textAlign: 'center',
    marginBottom: 10,
  },
  diagramContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  diagramTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#424242',
    textAlign: 'center',
  },
  diagram: {
    alignItems: 'center',
    padding: 10,
  },
  diagramText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MeasurementFormScreen;

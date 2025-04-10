import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../contexts/ApiContext';

const ClinicRegistrationScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigation = useNavigation();
  const { loading: apiLoading } = useApi();
  
  // Função para formatar CNPJ enquanto digita
  const formatCNPJ = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '.' + cleaned.substring(2);
    }
    if (cleaned.length > 5) {
      formatted = formatted.substring(0, 6) + '.' + cleaned.substring(6);
    }
    if (cleaned.length > 8) {
      formatted = formatted.substring(0, 10) + '/' + cleaned.substring(10);
    }
    if (cleaned.length > 12) {
      formatted = formatted.substring(0, 15) + '-' + cleaned.substring(15);
    }
    
    return formatted.substring(0, 18);
  };
  
  const handleCNPJChange = (text: string) => {
    setCnpj(formatCNPJ(text));
  };
  
  // Função para formatar telefone enquanto digita
  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 0) {
      formatted = '(' + cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted = formatted + ') ' + cleaned.substring(2);
    }
    if (cleaned.length > 6) {
      formatted = formatted.substring(0, 10) + '-' + cleaned.substring(6);
    }
    
    return formatted.substring(0, 15);
  };
  
  const handlePhoneChange = (text: string) => {
    setPhone(formatPhone(text));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome da clínica é obrigatório';
    }
    
    if (cnpj.trim() && cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ inválido';
    }
    
    if (!address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    if (!city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }
    
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Aqui seria a chamada para a API para salvar a clínica
      // await api.post('/clinics', { name, cnpj, address, city, state, phone, email, isDefault });
      
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Sucesso',
        'Clínica cadastrada com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a clínica');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E88E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro de Clínica</Text>
        <View style={{ width: 32 }} />
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome da Clínica *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Nome da clínica"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CNPJ</Text>
          <TextInput
            style={[styles.input, errors.cnpj && styles.inputError]}
            value={cnpj}
            onChangeText={handleCNPJChange}
            placeholder="00.000.000/0000-00"
            keyboardType="numeric"
          />
          {errors.cnpj && <Text style={styles.errorText}>{errors.cnpj}</Text>}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Endereço *</Text>
          <TextInput
            style={[styles.input, errors.address && styles.inputError]}
            value={address}
            onChangeText={setAddress}
            placeholder="Rua, número, complemento"
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>
        
        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 2, marginRight: 8 }]}>
            <Text style={styles.label}>Cidade *</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              value={city}
              onChangeText={setCity}
              placeholder="Cidade"
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>
          
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Estado *</Text>
            <TextInput
              style={[styles.input, errors.state && styles.inputError]}
              value={state}
              onChangeText={setState}
              placeholder="UF"
              maxLength={2}
              autoCapitalize="characters"
            />
            {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="email@clinica.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Definir como clínica padrão</Text>
          <Switch
            trackColor={{ false: "#BBDEFB", true: "#64B5F6" }}
            thumbColor={isDefault ? "#1E88E5" : "#f4f3f4"}
            ios_backgroundColor="#BBDEFB"
            onValueChange={setIsDefault}
            value={isDefault}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.saveButton, (loading || apiLoading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading || apiLoading}
        >
          {loading || apiLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    color: '#212121',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#212121',
  },
  saveButton: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#BBDEFB',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClinicRegistrationScreen;

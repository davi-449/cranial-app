import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApi } from '../contexts/ApiContext';
import NumericInput from '../components/NumericInput';
import { Ionicons } from '@expo/vector-icons';
import { Colors, CommonStyles } from '../styles/theme';

const PatientFormScreen: React.FC = () => {
  // Dados do paciente
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  
  // Dados dos pais (novos campos)
  const [motherName, setMotherName] = useState('');
  const [motherCPF, setMotherCPF] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [motherEmail, setMotherEmail] = useState('');
  const [motherBirthDate, setMotherBirthDate] = useState('');
  
  const [fatherName, setFatherName] = useState('');
  const [fatherCPF, setFatherCPF] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [fatherEmail, setFatherEmail] = useState('');
  const [fatherBirthDate, setFatherBirthDate] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const route = useRoute();
  const { createPatient, loading } = useApi();
  const navigation = useNavigation();
  
  // Efeito para mostrar mensagem de sucesso temporária
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // Funções para formatar CPF
  const formatCPF = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 3) {
      formatted = cleaned.substring(0, 3) + '.' + cleaned.substring(3);
    }
    if (cleaned.length > 6) {
      formatted = formatted.substring(0, 7) + '.' + cleaned.substring(7);
    }
    if (cleaned.length > 9) {
      formatted = formatted.substring(0, 11) + '-' + cleaned.substring(11);
    }
    
    return formatted.substring(0, 14);
  };
  
  const handleMotherCPFChange = (text: string) => {
    setMotherCPF(formatCPF(text));
  };
  
  const handleFatherCPFChange = (text: string) => {
    setFatherCPF(formatCPF(text));
  };
  
  // Funções para formatar telefone
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
  
  const handleMotherPhoneChange = (text: string) => {
    setMotherPhone(formatPhone(text));
  };
  
  const handleFatherPhoneChange = (text: string) => {
    setFatherPhone(formatPhone(text));
  };
  
  // Funções para formatar data
  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length > 4) {
      formatted = formatted.substring(0, 5) + '/' + cleaned.substring(4);
    }
    
    return formatted.substring(0, 10);
  };
  
  const handleBirthDateChange = (text: string) => {
    setBirthDate(formatDate(text));
  };
  
  const handleMotherBirthDateChange = (text: string) => {
    setMotherBirthDate(formatDate(text));
  };
  
  const handleFatherBirthDateChange = (text: string) => {
    setFatherBirthDate(formatDate(text));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validação dos dados do paciente
    if (!name.trim()) {
      newErrors.name = 'Nome do paciente é obrigatório';
    }
    
    if (!birthDate.trim()) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      newErrors.birthDate = 'Data inválida. Use o formato DD/MM/AAAA';
    }
    
    // Validação dos dados da mãe (obrigatórios)
    if (!motherName.trim()) {
      newErrors.motherName = 'Nome da mãe é obrigatório';
    }
    
    if (!motherCPF.trim()) {
      newErrors.motherCPF = 'CPF da mãe é obrigatório';
    } else if (motherCPF.replace(/\D/g, '').length !== 11) {
      newErrors.motherCPF = 'CPF inválido';
    }
    
    if (!motherPhone.trim()) {
      newErrors.motherPhone = 'Telefone da mãe é obrigatório';
    } else if (motherPhone.replace(/\D/g, '').length < 10) {
      newErrors.motherPhone = 'Telefone inválido';
    }
    
    // Validação de e-mail (opcional)
    if (motherEmail.trim() && !/\S+@\S+\.\S+/.test(motherEmail)) {
      newErrors.motherEmail = 'E-mail inválido';
    }
    
    if (fatherEmail.trim() && !/\S+@\S+\.\S+/.test(fatherEmail)) {
      newErrors.fatherEmail = 'E-mail inválido';
    }
    
    // Validação de CPF do pai (opcional)
    if (fatherCPF.trim() && fatherCPF.replace(/\D/g, '').length !== 11) {
      newErrors.fatherCPF = 'CPF inválido';
    }
    
    // Validação de telefone do pai (opcional)
    if (fatherPhone.trim() && fatherPhone.replace(/\D/g, '').length < 10) {
      newErrors.fatherPhone = 'Telefone inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // Converter datas para o formato ISO
      const formatISODate = (dateStr: string) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
      };
      
      const patientData = {
        name,
        birthDate: formatISODate(birthDate),
        gender: gender || null,
        parents: {
          mother: {
            name: motherName,
            cpf: motherCPF.replace(/\D/g, ''),
            phone: motherPhone.replace(/\D/g, ''),
            email: motherEmail || null,
            birthDate: motherBirthDate ? formatISODate(motherBirthDate) : null
          },
          father: {
            name: fatherName || null,
            cpf: fatherCPF ? fatherCPF.replace(/\D/g, '') : null,
            phone: fatherPhone ? fatherPhone.replace(/\D/g, '') : null,
            email: fatherEmail || null,
            birthDate: fatherBirthDate ? formatISODate(fatherBirthDate) : null
          }
        }
      };
      
      await createPatient(patientData);
      
      // Limpar formulário
      setName('');
      setBirthDate('');
      setGender('');
      setMotherName('');
      setMotherCPF('');
      setMotherPhone('');
      setMotherEmail('');
      setMotherBirthDate('');
      setFatherName('');
      setFatherCPF('');
      setFatherPhone('');
      setFatherEmail('');
      setFatherBirthDate('');
      
      // Mostrar feedback de sucesso
      setSuccessMessage('Paciente cadastrado com sucesso!');
      
      // Mostrar toast no Android
      if (Platform.OS === 'android') {
        ToastAndroid.show('Paciente cadastrado com sucesso!', ToastAndroid.SHORT);
      }
      
      // Mostrar alerta e navegar de volta
      Alert.alert(
        'Sucesso',
        'Paciente cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o paciente');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastro de Paciente</Text>
        
        {successMessage && (
          <View style={CommonStyles.successMessage}>
            <Text style={CommonStyles.successMessageText}>{successMessage}</Text>
          </View>
        )}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados do Paciente</Text>
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Nome completo *</Text>
          <TextInput
            style={[CommonStyles.input, errors.name && CommonStyles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Nome completo do paciente"
          />
          {errors.name && <Text style={CommonStyles.errorText}>{errors.name}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Data de nascimento *</Text>
          <TextInput
            style={[CommonStyles.input, errors.birthDate && CommonStyles.inputError]}
            value={birthDate}
            onChangeText={handleBirthDateChange}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
          />
          {errors.birthDate && <Text style={CommonStyles.errorText}>{errors.birthDate}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Gênero</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'male' && styles.genderOptionSelected
              ]}
              onPress={() => setGender('male')}
            >
              <Text
                style={[
                  styles.genderOptionText,
                  gender === 'male' && styles.genderOptionTextSelected
                ]}
              >
                Masculino
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'female' && styles.genderOptionSelected
              ]}
              onPress={() => setGender('female')}
            >
              <Text
                style={[
                  styles.genderOptionText,
                  gender === 'female' && styles.genderOptionTextSelected
                ]}
              >
                Feminino
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'other' && styles.genderOptionSelected
              ]}
              onPress={() => setGender('other')}
            >
              <Text
                style={[
                  styles.genderOptionText,
                  gender === 'other' && styles.genderOptionTextSelected
                ]}
              >
                Outro
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados da Mãe</Text>
          <Text style={styles.requiredNote}>* Campos obrigatórios</Text>
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Nome completo *</Text>
          <TextInput
            style={[CommonStyles.input, errors.motherName && CommonStyles.inputError]}
            value={motherName}
            onChangeText={setMotherName}
            placeholder="Nome completo da mãe"
          />
          {errors.motherName && <Text style={CommonStyles.errorText}>{errors.motherName}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>CPF *</Text>
          <TextInput
            style={[CommonStyles.input, errors.motherCPF && CommonStyles.inputError]}
            value={motherCPF}
            onChangeText={handleMotherCPFChange}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            maxLength={14}
          />
          {errors.motherCPF && <Text style={CommonStyles.errorText}>{errors.motherCPF}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Telefone *</Text>
          <TextInput
            style={[CommonStyles.input, errors.motherPhone && CommonStyles.inputError]}
            value={motherPhone}
            onChangeText={handleMotherPhoneChange}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            maxLength={15}
          />
          {errors.motherPhone && <Text style={CommonStyles.errorText}>{errors.motherPhone}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>E-mail</Text>
          <TextInput
            style={[CommonStyles.input, errors.motherEmail && CommonStyles.inputError]}
            value={motherEmail}
            onChangeText={setMotherEmail}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.motherEmail && <Text style={CommonStyles.errorText}>{errors.motherEmail}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Data de nascimento</Text>
          <TextInput
            style={CommonStyles.input}
            value={motherBirthDate}
            onChangeText={handleMotherBirthDateChange}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados do Pai</Text>
          <Text style={styles.optionalNote}>(Opcional)</Text>
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Nome completo</Text>
          <TextInput
            style={CommonStyles.input}
            value={fatherName}
            onChangeText={setFatherName}
            placeholder="Nome completo do pai"
          />
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>CPF</Text>
          <TextInput
            style={[CommonStyles.input, errors.fatherCPF && CommonStyles.inputError]}
            value={fatherCPF}
            onChangeText={handleFatherCPFChange}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            maxLength={14}
          />
          {errors.fatherCPF && <Text style={CommonStyles.errorText}>{errors.fatherCPF}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Telefone</Text>
          <TextInput
            style={[CommonStyles.input, errors.fatherPhone && CommonStyles.inputError]}
            value={fatherPhone}
            onChangeText={handleFatherPhoneChange}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            maxLength={15}
          />
          {errors.fatherPhone && <Text style={CommonStyles.errorText}>{errors.fatherPhone}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>E-mail</Text>
          <TextInput
            style={[CommonStyles.input, errors.fatherEmail && CommonStyles.inputError]}
            value={fatherEmail}
            onChangeText={setFatherEmail}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.fatherEmail && <Text style={CommonStyles.errorText}>{errors.fatherEmail}</Text>}
        </View>
        
        <View style={CommonStyles.inputContainer}>
          <Text style={CommonStyles.label}>Data de nascimento</Text>
          <TextInput
            style={CommonStyles.input}
            value={fatherBirthDate}
            onChangeText={handleFatherBirthDateChange}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        
        <TouchableOpacity
          style={[CommonStyles.button, loading && CommonStyles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={CommonStyles.buttonText}>Cadastrar Paciente</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
  },
  formContainer: {
    ...CommonStyles.formContainer,
  },
  title: {
    ...CommonStyles.title,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLighter,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  requiredNote: {
    fontSize: 12,
    color: Colors.error,
  },
  optionalNote: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  genderOptionSelected: {
    backgroundColor: Colors.primaryLighter,
    borderColor: Colors.primary,
  },
  genderOptionText: {
    color: Colors.textSecondary,
  },
  genderOptionTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default PatientFormScreen;

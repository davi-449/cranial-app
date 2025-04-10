import React, { useCallback, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen: React.FC = () => {
  const { signed, loading: authLoading, signIn, authError, clearAuthError } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Formulário de login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Campos adicionais para registro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Limpar erros quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      clearAuthError();
      setFormErrors({});
    }, [])
  );

  // Atualizar estado de loading local quando authLoading mudar
  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading]);

  // Mostrar erro de autenticação quando ocorrer
  useEffect(() => {
    if (authError) {
      Alert.alert('Erro de autenticação', authError);
    }
  }, [authError]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!username) {
      errors.username = 'Usuário é obrigatório';
    }
    
    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (isRegisterMode) {
      if (!name) {
        errors.name = 'Nome é obrigatório';
      }
      
      if (!email) {
        errors.email = 'E-mail é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'E-mail inválido';
      }
      
      if (password !== confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await signIn(username, password);
    } catch (error) {
      // O erro já é tratado no AuthContext
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username,
        password,
        name,
        email,
      });
      
      // Limpar campos e voltar para o modo de login
      setName('');
      setEmail('');
      setConfirmPassword('');
      setIsRegisterMode(false);
      
    } catch (error) {
      // O erro já é tratado no AuthContext
    } finally {
      setLoading(false);
    }
  };

  const toggleRegisterMode = () => {
    setIsRegisterMode(!isRegisterMode);
    clearAuthError();
    setFormErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Aplicativo de Medições Cranianas</Text>
            <Text style={styles.subtitle}>
              {isRegisterMode ? 'Crie sua conta' : 'Faça login para continuar'}
            </Text>

            {isRegisterMode && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nome completo</Text>
                  <TextInput
                    style={[styles.input, formErrors.name && styles.inputError]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Digite seu nome completo"
                  />
                  {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>E-mail</Text>
                  <TextInput
                    style={[styles.input, formErrors.email && styles.inputError]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite seu e-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Usuário</Text>
              <TextInput
                style={[styles.input, formErrors.username && styles.inputError]}
                value={username}
                onChangeText={setUsername}
                placeholder="Digite seu usuário"
                autoCapitalize="none"
              />
              {formErrors.username && <Text style={styles.errorText}>{formErrors.username}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, formErrors.password && styles.inputError]}
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                secureTextEntry
              />
              {formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}
            </View>

            {isRegisterMode && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar senha</Text>
                <TextInput
                  style={[styles.input, formErrors.confirmPassword && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirme sua senha"
                  secureTextEntry
                />
                {formErrors.confirmPassword && (
                  <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={isRegisterMode ? handleRegister : handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isRegisterMode ? 'Cadastrar' : 'Entrar'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleRegisterMode}
              disabled={loading}
            >
              <Text style={styles.toggleButtonText}>
                {isRegisterMode
                  ? 'Já tem uma conta? Faça login'
                  : 'Não tem uma conta? Cadastre-se'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1E88E5', // Nova cor azul conforme solicitado
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#757575',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#424242',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#1E88E5', // Nova cor azul conforme solicitado
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#1E88E5', // Nova cor azul conforme solicitado
    fontSize: 14,
  },
});

export default LoginScreen;

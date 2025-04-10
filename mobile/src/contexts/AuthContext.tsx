import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Alert } from 'react-native';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name?: string;
  profileImage?: string;
  clinic?: string;
  function?: string;
  darkMode?: boolean;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  authError: string | null;
  signIn(username: string, password: string): Promise<void>;
  signOut(): void;
  registerUser(userData: RegisterUserData): Promise<void>;
  updateUserProfile(userData: Partial<User>): Promise<void>;
  toggleDarkMode(): Promise<void>;
  clearAuthError(): void;
}

interface RegisterUserData {
  username: string;
  password: string;
  email: string;
  name: string;
  role?: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStorageData() {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem('@CranialApp:user');
        const storedToken = await AsyncStorage.getItem('@CranialApp:token');

        if (storedUser && storedToken) {
          api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const clearAuthError = () => {
    setAuthError(null);
  };

  async function signIn(username: string, password: string) {
    setLoading(true);
    setAuthError(null);
    
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { token, user: userData } = response.data;

      await AsyncStorage.setItem('@CranialApp:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@CranialApp:token', token);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setUser(userData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAuthError('Falha na autenticação. Verifique suas credenciais.');
      throw new Error('Falha na autenticação. Verifique suas credenciais.');
    }
  }

  async function registerUser(userData: RegisterUserData) {
    setLoading(true);
    setAuthError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      
      Alert.alert(
        'Sucesso', 
        'Usuário registrado com sucesso! Você já pode fazer login.',
        [{ text: 'OK' }]
      );
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Erro ao registrar usuário. Tente novamente.';
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async function updateUserProfile(userData: Partial<User>) {
    setLoading(true);
    
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const response = await api.put(`/users/${user.id}`, userData);
      const updatedUser = { ...user, ...userData };
      
      await AsyncStorage.setItem('@CranialApp:user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      throw error;
    }
  }

  async function toggleDarkMode() {
    if (!user) return;
    
    const newDarkMode = !user.darkMode;
    const updatedUser = { ...user, darkMode: newDarkMode };
    
    await AsyncStorage.setItem('@CranialApp:user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    try {
      await api.put(`/users/${user.id}`, { darkMode: newDarkMode });
    } catch (error) {
      console.error('Erro ao salvar preferência de tema no servidor:', error);
      // Continua mesmo com erro, pois a preferência já foi salva localmente
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@CranialApp:user');
    await AsyncStorage.removeItem('@CranialApp:token');
    setUser(null);
  }

  return (
    <AuthContext.Provider 
      value={{ 
        signed: !!user, 
        user, 
        loading, 
        authError,
        signIn, 
        signOut,
        registerUser,
        updateUserProfile,
        toggleDarkMode,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

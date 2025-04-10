import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface ApiContextData {
  loading: boolean;
  error: string | null;
  clearError(): void;
  getPatients(): Promise<any[]>;
  getPatient(id: number): Promise<any>;
  createPatient(data: any): Promise<any>;
  updatePatient(id: number, data: any): Promise<any>;
  deletePatient(id: number): Promise<void>;
  addMeasurement(patientId: number, data: any): Promise<any>;
  getPatientReport(patientId: number): Promise<any>;
  refreshData(): Promise<void>;
}

interface ApiProviderProps {
  children: React.ReactNode;
}

const ApiContext = createContext<ApiContextData>({} as ApiContextData);

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientsData, setPatientsData] = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await refreshData();
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      }
    };

    loadInitialData();
  }, []);

  const clearError = () => {
    setError(null);
  };

  // Função para atualizar todos os dados em cache
  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Buscar lista de pacientes diretamente da API
      const response = await api.get('/patients');
      const patients = response.data;
      
      // Atualizar o estado e o cache
      setPatientsData(patients);
      await AsyncStorage.setItem('@CranialApp:patients', JSON.stringify(patients));
      
      setLastRefresh(new Date());
      setLoading(false);
      return patients;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Ocorreu um erro inesperado');
      }
      
      // Tentar usar cache se disponível
      const cachedData = await AsyncStorage.getItem('@CranialApp:patients');
      if (cachedData) {
        const patients = JSON.parse(cachedData);
        setPatientsData(patients);
      }
      
      setLoading(false);
      throw err;
    }
  };

  // Função para lidar com requisições com cache offline
  const handleRequest = async (
    key: string,
    request: () => Promise<any>,
    forceRefresh = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se há dados em cache
      const cachedData = await AsyncStorage.getItem(`@CranialApp:${key}`);
      
      // Se não forçar atualização e tiver cache, retorna o cache
      if (!forceRefresh && cachedData) {
        setLoading(false);
        return JSON.parse(cachedData);
      }

      // Fazer a requisição
      const response = await request();
      
      // Salvar no cache
      await AsyncStorage.setItem(`@CranialApp:${key}`, JSON.stringify(response.data));
      
      setLoading(false);
      return response.data;
    } catch (err) {
      // Se estiver offline e tiver cache, usa o cache
      if (!navigator.onLine) {
        const cachedData = await AsyncStorage.getItem(`@CranialApp:${key}`);
        if (cachedData) {
          setLoading(false);
          return JSON.parse(cachedData);
        }
      }

      // Tratar erro
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Ocorreu um erro inesperado');
      }
      
      setLoading(false);
      throw err;
    }
  };

  // Funções de API
  const getPatients = async () => {
    // Usar dados em memória se disponíveis e recentes (menos de 30 segundos)
    const now = new Date();
    const timeDiff = now.getTime() - lastRefresh.getTime();
    
    if (patientsData.length > 0 && timeDiff < 30000) {
      return patientsData;
    }
    
    // Caso contrário, buscar da API e atualizar o estado
    const patients = await handleRequest('patients', () => api.get('/patients'), true);
    setPatientsData(patients);
    setLastRefresh(new Date());
    return patients;
  };

  const getPatient = async (id: number) => {
    return handleRequest(`patient_${id}`, () => api.get(`/patients/${id}`), true);
  };

  const createPatient = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/patients', data);
      
      // Atualizar o estado e o cache
      const newPatient = response.data;
      const updatedPatients = [...patientsData, newPatient];
      
      setPatientsData(updatedPatients);
      await AsyncStorage.setItem('@CranialApp:patients', JSON.stringify(updatedPatients));
      await AsyncStorage.setItem(`@CranialApp:patient_${newPatient.id}`, JSON.stringify(newPatient));
      
      setLoading(false);
      return newPatient;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao criar paciente');
      } else {
        setError('Ocorreu um erro inesperado');
      }
      
      setLoading(false);
      throw err;
    }
  };

  const updatePatient = async (id: number, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/patients/${id}`, data);
      const updatedPatient = response.data;
      
      // Atualizar cache e estado
      await AsyncStorage.setItem(`@CranialApp:patient_${id}`, JSON.stringify(updatedPatient));
      
      // Atualizar a lista de pacientes em memória
      const updatedPatients = patientsData.map(patient => 
        patient.id === id ? updatedPatient : patient
      );
      
      setPatientsData(updatedPatients);
      await AsyncStorage.setItem('@CranialApp:patients', JSON.stringify(updatedPatients));
      
      setLoading(false);
      return updatedPatient;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao atualizar paciente');
      } else {
        setError('Ocorreu um erro inesperado');
      }
      
      setLoading(false);
      throw err;
    }
  };

  const deletePatient = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/patients/${id}`);
      
      // Remover do cache
      await AsyncStorage.removeItem(`@CranialApp:patient_${id}`);
      
      // Atualizar a lista de pacientes em memória
      const updatedPatients = patientsData.filter(patient => patient.id !== id);
      setPatientsData(updatedPatients);
      
      // Atualizar o cache da lista
      await AsyncStorage.setItem('@CranialApp:patients', JSON.stringify(updatedPatients));
      
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao excluir paciente');
      } else {
        setError('Ocorreu um erro inesperado');
      }
      
      setLoading(false);
      throw err;
    }
  };

  const addMeasurement = async (patientId: number, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/patients/${patientId}/measurements`, data);
      const newMeasurement = response.data;
      
      // Invalidar cache do paciente para forçar atualização
      await AsyncStorage.removeItem(`@CranialApp:patient_${patientId}`);
      
      // Buscar dados atualizados do paciente
      const updatedPatient = await getPatient(patientId);
      
      // Atualizar a lista de pacientes em memória
      const updatedPatients = patientsData.map(patient => 
        patient.id === patientId ? updatedPatient : patient
      );
      
      setPatientsData(updatedPatients);
      await AsyncStorage.setItem('@CranialApp:patients', JSON.stringify(updatedPatients));
      
      setLoading(false);
      return newMeasurement;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao adicionar medição');
      } else {
        setError('Ocorreu um erro inesperado');
      }
      
      setLoading(false);
      throw err;
    }
  };

  const getPatientReport = async (patientId: number) => {
    return handleRequest(`patient_${patientId}_report`, () => 
      api.get(`/patients/${patientId}/report`)
    , true);
  };

  return (
    <ApiContext.Provider
      value={{
        loading,
        error,
        clearError,
        getPatients,
        getPatient,
        createPatient,
        updatePatient,
        deletePatient,
        addMeasurement,
        getPatientReport,
        refreshData,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export function useApi() {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return context;
}

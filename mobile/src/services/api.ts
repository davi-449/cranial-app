import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sanitizeObject, sanitizeUrlParams } from '../utils/security';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação e sanitizar dados
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@CranialApp:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Sanitizar dados de requisição para prevenir injeção SQL e XSS
    if (config.params) {
      // Sanitizar parâmetros de URL
      const sanitizedParams = sanitizeObject(config.params);
      config.params = sanitizedParams;
    }
    
    if (config.data) {
      // Sanitizar corpo da requisição
      config.data = sanitizeObject(config.data);
    }
    
    // Sanitizar URL para requisições GET com parâmetros na URL
    if (config.url && config.url.includes('?')) {
      const [baseUrl, queryString] = config.url.split('?');
      const params = {};
      
      // Converter string de consulta em objeto
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
      
      // Sanitizar e reconstruir URL
      config.url = `${baseUrl}?${sanitizeUrlParams(params)}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Verificar se o erro é de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Limpar dados de autenticação
      await AsyncStorage.removeItem('@CranialApp:user');
      await AsyncStorage.removeItem('@CranialApp:token');
      
      // Redirecionar para login (isso seria feito pelo contexto de autenticação)
    }
    
    return Promise.reject(error);
  }
);

export default api;

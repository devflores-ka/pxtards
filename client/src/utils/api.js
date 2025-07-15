// client/src/utils/api.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - añadir token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token') || localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de request en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    // Log de response exitoso en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    
    return response;
  },
  (error) => {
    // Log de error
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      // Token inválido o expirado
      console.warn('🔒 Token inválido o expirado. Limpiando sesión...');
      
      // Limpiar tokens
      Cookies.remove('auth_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Redirigir al login solo si no estamos ya en la página de login
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/')) {
        window.location.href = '/';
      }
    }
    
    if (error.response?.status === 429) {
      console.warn('⚠️ Rate limit excedido. Intenta de nuevo más tarde.');
    }
    
    if (error.response?.status >= 500) {
      console.error('🔥 Error del servidor. Por favor, intenta más tarde.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
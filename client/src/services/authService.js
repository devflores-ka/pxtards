// client/src/services/authService.js
import api from '../utils/api';
import { API_ENDPOINTS } from '../config/api';
import Cookies from 'js-cookie';

class AuthService {
  // Guardar token y datos de usuario
  setAuthData(token, user) {
    // Guardar token en cookies (más seguro para SSR) y localStorage como fallback
    Cookies.set('auth_token', token, { 
      expires: 7, // 7 días
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    localStorage.setItem('auth_token', token);
    
    // Guardar datos del usuario
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // Obtener token
  getToken() {
    return Cookies.get('auth_token') || localStorage.getItem('auth_token');
  }

  // Obtener datos del usuario
  getUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.getToken();
  }

  // Limpiar datos de autenticación
  clearAuthData() {
    Cookies.remove('auth_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Registrar usuario
  async register(userData) {
    try {
      console.log('🔄 Enviando datos de registro:', userData);
      
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      if (response.data.token && response.data.user) {
        this.setAuthData(response.data.token, response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Headers:', error.response?.headers);
      
      // Mostrar detalles específicos del error
      if (error.response?.data?.details) {
        console.error('❌ Validation details:', error.response.data.details);
      }
      
      throw new Error(
        error.response?.data?.details?.join(', ') || 
        error.response?.data?.message || 
        'Error durante el registro'
      );
    }
  }

  // Iniciar sesión
  async login(credentials) {
    try {
      console.log('🔄 Enviando datos de login:', credentials);
      
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      if (response.data.token && response.data.user) {
        this.setAuthData(response.data.token, response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Response data:', error.response?.data);
      
      throw new Error(
        error.response?.data?.details?.join(', ') || 
        error.response?.data?.message || 
        'Error durante el inicio de sesión'
      );
    }
  }

  // Obtener perfil del usuario actual
  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      
      // Actualizar datos del usuario en localStorage
      if (response.data.user) {
        const currentToken = this.getToken();
        this.setAuthData(currentToken, response.data.user);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener el perfil'
      );
    }
  }

  // Refrescar token
  async refreshToken() {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
      
      if (response.data.token) {
        const currentUser = this.getUser();
        this.setAuthData(response.data.token, currentUser);
      }
      
      return response.data;
    } catch (error) {
      // Si no se puede refrescar el token, cerrar sesión
      this.logout();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      // Opcional: notificar al servidor sobre el logout
      if (this.isAuthenticated()) {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.warn('Error al notificar logout al servidor:', error);
    } finally {
      // Siempre limpiar datos locales
      this.clearAuthData();
    }
  }

  // Verificar si el token está próximo a expirar y renovarlo
  async checkAndRefreshToken() {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      // Intentar obtener el perfil para verificar que el token es válido
      await this.getProfile();
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await this.refreshToken();
          return true;
        } catch (refreshError) {
          this.logout();
          return false;
        }
      }
      return true; // Otros errores no relacionados con autenticación
    }
  }
}

// Exportar instancia singleton
const authService = new AuthService();
export default authService;
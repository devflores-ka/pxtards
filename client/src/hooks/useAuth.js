// client/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar autenticación al cargar el hook
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const isValid = await authService.checkAndRefreshToken();
          
          if (isValid) {
            const userData = authService.getUser();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Función de login
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success('¡Bienvenido de vuelta!');
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de registro
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success('¡Cuenta creada exitosamente!');
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Siempre limpiar el estado local aunque falle la petición al servidor
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Función para actualizar perfil
  const updateProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }, []);

  // Función para verificar autenticación
  const checkAuth = useCallback(async () => {
    try {
      const isValid = await authService.checkAndRefreshToken();
      
      if (!isValid) {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      return isValid;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    
    // Funciones
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    
    // Utilidades
    isCreator: user?.isCreator || false,
    isVerified: user?.isVerified || false,
  };
};
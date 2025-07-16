// client/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Función de inicialización
  const initAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (authService.isAuthenticated()) {
        console.log('🔍 Token encontrado, verificando validez...');
        const isValid = await authService.checkAndRefreshToken();
        
        if (isValid) {
          const userData = authService.getUser();
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ Usuario autenticado:', userData.username);
        } else {
          console.log('❌ Token inválido, limpiando datos');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('ℹ️ No hay token, usuario no autenticado');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Error en inicialización:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inicializar al montar el componente
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Función de login con navegación automática
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success(`¡Bienvenido, ${response.user.username}!`);
      
      // Navegar al dashboard después del login exitoso
      navigate('/dashboard', { replace: true });
      
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Función de registro con navegación automática
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success('¡Cuenta creada exitosamente!');
      
      // Navegar al dashboard después del registro exitoso
      navigate('/dashboard', { replace: true });
      
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Función de logout con navegación automática
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      toast.success('Sesión cerrada correctamente');
      
      // Navegar al home después del logout
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Siempre limpiar el estado local aunque falle la petición al servidor
      setUser(null);
      setIsAuthenticated(false);
      navigate('/', { replace: true });
    }
  }, [navigate]);

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
        navigate('/', { replace: true });
      }
      
      return isValid;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/', { replace: true });
      return false;
    }
  }, [navigate]);

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
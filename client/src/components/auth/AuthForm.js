// client/src/components/auth/AuthForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const AuthForm = ({ onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, register: registerUser, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      if (activeTab === 'login') {
        await login({
          email: data.email,
          password: data.password
        });
      } else {
        await registerUser({
          username: data.username,
          email: data.email,
          password: data.password,
          displayName: data.displayName,
          isCreator: data.isCreator || false
        });
      }
      
      onClose?.();
      reset();
    } catch (error) {
      // El error ya se maneja en el hook useAuth con toast
      console.error('Error en el formulario:', error);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Pestañas */}
      <div className="flex bg-black/30 rounded-lg p-1 mb-6">
        <button
          onClick={() => switchTab('login')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'login' 
              ? 'bg-purple-600 text-white' 
              : 'text-purple-300 hover:text-white'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => switchTab('register')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'register' 
              ? 'bg-purple-600 text-white' 
              : 'text-purple-300 hover:text-white'
          }`}
        >
          Registro
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username (solo en registro) */}
        {activeTab === 'register' && (
          <div>
            <input
              {...register('username', {
                required: 'El nombre de usuario es requerido',
                minLength: {
                  value: 3,
                  message: 'Mínimo 3 caracteres'
                },
                maxLength: {
                  value: 30,
                  message: 'Máximo 30 caracteres'
                },
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: 'Solo letras y números'
                }
              })}
              type="text"
              placeholder="Nombre de usuario"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
        )}

        {/* Display Name (solo en registro) */}
        {activeTab === 'register' && (
          <div>
            <input
              {...register('displayName', {
                minLength: {
                  value: 2,
                  message: 'Mínimo 2 caracteres'
                },
                maxLength: {
                  value: 100,
                  message: 'Máximo 100 caracteres'
                }
              })}
              type="text"
              placeholder="Nombre para mostrar (opcional)"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
            />
            {errors.displayName && (
              <p className="text-red-400 text-sm mt-1">{errors.displayName.message}</p>
            )}
          </div>
        )}
        
        {/* Email */}
        <div>
          <input
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            type="email"
            placeholder="Email"
            className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* Password */}
        <div className="relative">
          <input
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres'
              },
              ...(activeTab === 'register' && {
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Debe contener mayúscula, minúscula y número'
                }
              })
            })}
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password (solo en registro) */}
        {activeTab === 'register' && (
          <div className="relative">
            <input
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: value => value === password || 'Las contraseñas no coinciden'
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        {/* Checkbox para creador (solo en registro) */}
        {activeTab === 'register' && (
          <label className="flex items-center gap-2 text-sm text-purple-300">
            <input 
              {...register('isCreator')}
              type="checkbox" 
              className="rounded border-purple-500" 
            />
            Quiero ser creador de contenido
          </label>
        )}

        {/* Botón de submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="animate-spin" size={20} />}
          {isLoading 
            ? (activeTab === 'login' ? 'Entrando...' : 'Creando cuenta...') 
            : (activeTab === 'login' ? 'Entrar' : 'Crear Cuenta')
          }
        </button>
      </form>

      {/* Switch entre login y registro */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          {activeTab === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button 
            onClick={() => switchTab(activeTab === 'login' ? 'register' : 'login')}
            className="text-purple-400 hover:text-purple-300 ml-1 font-medium"
          >
            {activeTab === 'login' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
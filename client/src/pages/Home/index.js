import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Heart, 
  Lock, 
  Crown, 
  Flame, 
  Users, 
  Star,
  Play,
  MessageCircle,
  Gift,
  Shield,
  ChevronRight,
  X,
  Loader2,
  User,
  LogOut
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user, isAuthenticated, login, register: registerUser, logout, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const password = watch('password');

  // Simulación de contenido para mostrar
  const featuredCreators = [
    {
      id: 1,
      name: "MistressDark",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      subscribers: "2.3K",
      isOnline: true,
      preview: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop"
    },
    {
      id: 2,
      name: "SinfulQueen",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      subscribers: "4.1K",
      isOnline: false,
      preview: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=300&h=400&fit=crop"
    },
    {
      id: 3,
      name: "DarkDesire",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
      subscribers: "1.8K",
      isOnline: true,
      preview: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=300&h=400&fit=crop"
    }
  ];

  const onSubmit = async (data) => {
    try {
      console.log('Datos del formulario:', data); // Debug
      
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
          displayName: data.displayName || data.username,
          isCreator: data.isCreator || false
        });
      }
      
      setShowLoginModal(false);
      reset();
    } catch (error) {
      console.error('Error en el formulario:', error);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (!isAgeVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black flex items-center justify-center p-4">
        <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-purple-500/30">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              PXTards
            </h1>
            <p className="text-purple-300 text-sm">Contenido Extremo para Adultos</p>
          </div>
          
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-red-400" size={20} />
              <h3 className="text-red-400 font-semibold">Advertencia de Contenido</h3>
            </div>
            <p className="text-red-300 text-sm">
              Este sitio contiene material explícito y fetiches extremos. 
              Solo para mayores de 18 años.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-white text-center">¿Eres mayor de 18 años?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsAgeVerified(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-lg font-semibold transition-all"
              >
                Sí, soy mayor
              </button>
              <button
                onClick={() => window.location.href = 'https://google.com'}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-all"
              >
                No, salir
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const LoginModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-black rounded-2xl p-6 max-w-md w-full border border-purple-500/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'login' ? 'Iniciar Sesión' : 'Registro'}
          </h2>
          <button 
            onClick={() => setShowLoginModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex bg-purple-900/50 rounded-lg p-1 mb-6">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {activeTab === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              onClick={() => switchTab(activeTab === 'login' ? 'register' : 'login')}
              className="text-purple-400 hover:text-purple-300 ml-1 font-medium"
            >
              {activeTab === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  const UserMenu = () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-white">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="text-sm">Hola, {user?.displayName || user?.username}</span>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
      >
        <LogOut size={16} />
        <span className="text-sm">Salir</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PXTards
              </h1>
              <Flame className="text-purple-400" size={24} />
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Explorar</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Creadores</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Premium</a>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setActiveTab('login');
                      setShowLoginModal(true);
                    }}
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('register');
                      setShowLoginModal(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                  >
                    Unirse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {isAuthenticated ? (
              <>
                Bienvenido de vuelta,
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  {user?.displayName || user?.username}
                </span>
              </>
            ) : (
              <>
                Explora tus
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  Fantasías Más Oscuras
                </span>
              </>
            )}
          </h2>
          
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            {isAuthenticated ? 
              'Descubre nuevo contenido exclusivo de tus creadores favoritos' :
              'La plataforma definitiva para contenido extremo y fetiches sin límites. Únete a una comunidad que abraza lo prohibido.'
            }
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={() => {
                  setActiveTab('register');
                  setShowLoginModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
              >
                Explorar Ahora
              </button>
              <button 
                onClick={() => {
                  setActiveTab('register');
                  setShowLoginModal(true);
                }}
                className="border border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Ser Creador
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <Lock className="text-purple-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Contenido Exclusivo</h3>
              <p className="text-purple-200">Acceso a fetiches y contenido que no encontrarás en ningún otro lugar</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <Crown className="text-purple-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Experiencia Premium</h3>
              <p className="text-purple-200">Interacción directa con creadores y contenido personalizado</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <Shield className="text-purple-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">100% Anónimo</h3>
              <p className="text-purple-200">Tu privacidad es nuestra prioridad. Navega sin preocupaciones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Creadores Destacados</h2>
            <p className="text-purple-200 text-lg">Descubre a los artistas más extremos de la plataforma</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCreators.map((creator) => (
              <div key={creator.id} className="bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition-all hover:transform hover:scale-105">
                <div className="relative">
                  <img 
                    src={creator.preview} 
                    alt={creator.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  <div className="absolute top-4 right-4">
                    {creator.isOnline && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                        En línea
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-2">
                      <img 
                        src={creator.image} 
                        alt={creator.name}
                        className="w-12 h-12 rounded-full border-2 border-purple-400"
                      />
                      <div>
                        <h3 className="text-white font-bold">{creator.name}</h3>
                        <p className="text-purple-300 text-sm">{creator.subscribers} seguidores</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (!isAuthenticated) {
                          setActiveTab('register');
                          setShowLoginModal(true);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg font-semibold transition-all"
                    >
                      {isAuthenticated ? 'Suscribirse' : 'Registrarse'}
                    </button>
                    <button className="bg-purple-900/50 text-purple-300 hover:bg-purple-800 p-2 rounded-lg transition-all">
                      <Heart size={20} />
                    </button>
                    <button className="bg-purple-900/50 text-purple-300 hover:bg-purple-800 p-2 rounded-lg transition-all">
                      <MessageCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
              <div className="text-purple-200">Usuarios Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">2K+</div>
              <div className="text-purple-200">Creadores</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">500K+</div>
              <div className="text-purple-200">Contenidos Únicos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-purple-200">Soporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-pink-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              ¿Listo para Descubrir lo Prohibido?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Únete a miles de usuarios que ya exploran sus fantasías más oscuras
            </p>
            <button 
              onClick={() => {
                setActiveTab('register');
                setShowLoginModal(true);
              }}
              className="bg-black hover:bg-gray-900 text-white px-12 py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105 border border-purple-400"
            >
              Comenzar Ahora
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black py-12 px-4 border-t border-purple-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                PXTards
              </h3>
              <p className="text-purple-300 text-sm">
                La plataforma definitiva para contenido extremo y sin límites.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Plataforma</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Explorar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Creadores</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Soporte</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reportar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-500/30 mt-8 pt-8 text-center">
            <p className="text-purple-400 text-sm">
              © 2024 PXTards. Solo para mayores de 18 años.
            </p>
          </div>
        </div>
      </footer>

      {showLoginModal && <LoginModal />}
    </div>
  );
};

export default Home;
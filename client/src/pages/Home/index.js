// client/src/pages/Home/index.js
import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Heart, 
  MessageCircle, 
  Star, 
  Crown, 
  Shield, 
  Users, 
  Camera, 
  Lock,
  User,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/auth/AuthForm';
import Dashboard from '../Dashboard';

const Home = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Efecto para monitorear cambios de autenticación
  useEffect(() => {
    console.log('🔍 Estado de autenticación cambió:', { 
      isAuthenticated, 
      user: user?.username,
      isLoading 
    });
  }, [isAuthenticated, user, isLoading]);

  // Cerrar modal cuando se autentica exitosamente
  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      console.log('✅ Usuario autenticado, cerrando modal');
      setShowLoginModal(false);
    }
  }, [isAuthenticated, showLoginModal]);

  // Si el usuario está autenticado, mostrar el dashboard
  if (isAuthenticated && user) {
    console.log('🚀 Redirigiendo al Dashboard para:', user.username);
    return <Dashboard />;
  }

  // Si aún está cargando, mostrar loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const featuredCreators = [
    {
      id: 1,
      name: 'Bella Storm',
      username: '@bella_storm',
      avatar: '/api/placeholder/80/80',
      banner: '/api/placeholder/300/200',
      followers: '125K',
      isVerified: true,
      type: 'Premium Model',
      preview: '/api/placeholder/200/300'
    },
    {
      id: 2,
      name: 'Sarah Fitness',
      username: '@sarah_fit',
      avatar: '/api/placeholder/80/80',
      banner: '/api/placeholder/300/200',
      followers: '89K',
      isVerified: true,
      type: 'Fitness Coach',
      preview: '/api/placeholder/200/300'
    },
    {
      id: 3,
      name: 'Luna Art',
      username: '@luna_creates',
      avatar: '/api/placeholder/80/80',
      banner: '/api/placeholder/300/200',
      followers: '67K',
      isVerified: false,
      type: 'Digital Artist',
      preview: '/api/placeholder/200/300'
    }
  ];

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
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Contenido
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}Exclusivo
              </span>
            </h2>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Descubre a los mejores creadores de contenido premium y accede a material exclusivo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                Explorar Ahora
              </button>
              <button className="border border-purple-400 text-purple-300 hover:bg-purple-900/50 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                Conoce Más
              </button>
            </div>
          </div>

          {/* Featured preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map(i => (
              <div key={i} className="relative group">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all">
                  <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
                    <Camera className="text-white opacity-50" size={48} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                    <span className="text-white font-medium">Creator {i}</span>
                    <Star className="text-purple-400" size={16} />
                  </div>
                  <p className="text-gray-300 text-sm">Contenido exclusivo disponible</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Creadores Destacados</h3>
            <p className="text-purple-200 text-lg">Los mejores creadores de contenido premium</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCreators.map(creator => (
              <div key={creator.id} className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition-all group">
                {/* Banner */}
                <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600">
                  <img 
                    src={creator.banner} 
                    alt="Banner"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Profile */}
                <div className="relative px-6 pb-6">
                  <div className="flex items-start justify-between -mt-8 mb-4">
                    <div className="relative">
                      <img 
                        src={creator.avatar} 
                        alt={creator.name}
                        className="w-16 h-16 rounded-full border-4 border-purple-500 bg-black"
                      />
                      {creator.isVerified && (
                        <Star className="absolute -top-1 -right-1 w-5 h-5 text-blue-400 fill-current" />
                      )}
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                      Seguir
                    </button>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-bold text-lg">{creator.name}</h4>
                    <p className="text-purple-300">{creator.username}</p>
                    <p className="text-gray-400 text-sm">{creator.type}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-white font-bold">{creator.followers}</div>
                        <div className="text-gray-400 text-xs">Seguidores</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="text-yellow-400" size={16} />
                      <span className="text-yellow-400 text-sm">Premium</span>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="relative rounded-lg overflow-hidden mb-4">
                    <img 
                      src={creator.preview} 
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white text-sm">Vista previa</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowLoginModal(true)}
                      className="flex-1 bg-purple-900/50 text-purple-300 hover:bg-purple-800 py-2 rounded-lg font-medium transition-all"
                    >
                      {creator.isVerified ? 'Suscribirse' : 'Registrarse'}
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

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">¿Por Qué PXTards?</h3>
            <p className="text-purple-200 text-lg">La mejor experiencia para creadores y usuarios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h4 className="text-white font-bold text-xl mb-2">Seguridad Total</h4>
              <p className="text-gray-300">Tu privacidad y seguridad son nuestra prioridad número uno</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-white" size={24} />
              </div>
              <h4 className="text-white font-bold text-xl mb-2">Contenido Premium</h4>
              <p className="text-gray-300">Accede a contenido exclusivo de los mejores creadores</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h4 className="text-white font-bold text-xl mb-2">Comunidad</h4>
              <p className="text-gray-300">Conecta con creadores y otros usuarios en nuestra comunidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Descubrir lo Prohibido?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Únete a miles de usuarios que ya disfrutan del mejor contenido premium
          </p>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-white text-purple-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all"
          >
            Comenzar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PXTards
                </h3>
                <Flame className="text-purple-400" size={20} />
              </div>
              <p className="text-gray-400">
                La plataforma líder para contenido premium y creadores exclusivos.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400">Explorar</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400">Creadores</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400">Premium</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400">Centro de Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400">Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400">Términos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 PXTards. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-purple-500/30">
            <div className="flex items-center justify-between mb-6">
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

            <AuthForm 
              onClose={() => setShowLoginModal(false)}
              initialTab={activeTab}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
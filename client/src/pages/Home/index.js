// client/src/pages/Home/index.js
import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import AuthForm from '../../components/auth/AuthForm';

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

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
      name: 'Alex Creative',
      username: '@alex_art',
      avatar: '/api/placeholder/80/80',
      banner: '/api/placeholder/300/200',
      followers: '67K',
      isVerified: false,
      type: 'Artist',
      preview: '/api/placeholder/200/300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Flame className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-white">PXTards</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  setActiveTab('login');
                  setShowLoginModal(true);
                }}
                className="text-white hover:text-purple-300 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => {
                  setActiveTab('register');
                  setShowLoginModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Conecta con tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">creadores favoritos</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a la plataforma más exclusiva para contenido premium. Apoya a tus creadores favoritos y disfruta de experiencias únicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setActiveTab('register');
                setShowLoginModal(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Comenzar Ahora
            </button>
            <button 
              onClick={() => {
                setActiveTab('login');
                setShowLoginModal(true);
              }}
              className="border-2 border-purple-400 text-purple-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all"
            >
              Explorar
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            ¿Por qué elegir PXTards?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 text-center border border-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-4">Contenido Exclusivo</h4>
              <p className="text-gray-300">
                Accede a contenido premium y exclusivo de tus creadores favoritos. Experiencias únicas que no encontrarás en otro lugar.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 text-center border border-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-4">Seguro y Privado</h4>
              <p className="text-gray-300">
                Tu privacidad es nuestra prioridad. Plataforma segura con encriptación de extremo a extremo y pagos protegidos.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 text-center border border-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-4">Comunidad</h4>
              <p className="text-gray-300">
                Únete a una comunidad vibrante. Interactúa directamente con creadores y otros fans en un ambiente respetuoso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Creadores Destacados
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCreators.map((creator) => (
              <div key={creator.id} className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all">
                <div className="relative">
                  <img 
                    src={creator.banner} 
                    alt={creator.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name}
                      className="w-12 h-12 rounded-full border-2 border-white"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <h4 className="text-white font-semibold">{creator.name}</h4>
                        {creator.isVerified && (
                          <Shield className="text-blue-400" size={16} />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{creator.username}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-400 text-sm">{creator.type}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="text-gray-400" size={16} />
                      <span className="text-gray-300 text-sm">{creator.followers}</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Comenzar tu Experiencia Premium?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Únete a miles de usuarios que ya disfrutan del mejor contenido exclusivo
          </p>
          <button 
            onClick={() => {
              setActiveTab('register');
              setShowLoginModal(true);
            }}
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
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Explorar</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Creadores</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Premium</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Comunidad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Guías</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Términos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">DMCA</a></li>
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

      {/* Modal de Login/Registro */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full relative border border-purple-500/20">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-gray-300">
                {activeTab === 'login' 
                  ? 'Accede a tu cuenta para continuar' 
                  : 'Únete a la comunidad exclusiva'
                }
              </p>
            </div>

            <AuthForm 
              mode={activeTab}
              onSwitchMode={switchTab}
              onSuccess={() => setShowLoginModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
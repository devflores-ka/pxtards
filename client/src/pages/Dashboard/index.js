// client/src/pages/Dashboard/index.js
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  Search,
  Bell,
  Mail,
  Settings,
  User,
  LogOut,
  Home,
  Flame,
  Star,
  Camera,
  Video,
  Image,
  DollarSign,
  Users,
  TrendingUp,
  Crown,
  Lock,
  Eye,
  Gift,
  Zap,
  X,
  MapPin,
  Info
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import FeedSection from '../../components/common/FeedSection';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentDateProfile, setCurrentDateProfile] = useState(null);
  const [dateProfiles, setDateProfiles] = useState([]);

  // Mock data para perfiles de Date
  const mockDateProfiles = [
    {
      id: 1,
      username: 'bella_creator',
      displayName: 'Isabella Rose',
      profileImage: '/api/placeholder/300/400',
      age: 24,
      location: 'Los Angeles, CA',
      bio: 'Modelo y content creator. Me encanta la fotografía artística y el fitness. Busco conectar con personas auténticas 💫',
      interests: ['Fotografía', 'Fitness', 'Arte', 'Viajes', 'Música'],
      tier: 'premium',
      subscriptionPrice: 19.99,
      isVerified: true,
      followerCount: '12.5K'
    },
    {
      id: 2,
      username: 'sarah_fit',
      displayName: 'Sarah Williams',
      profileImage: '/api/placeholder/300/400',
      age: 26,
      location: 'Miami, FL',
      bio: 'Coach de fitness y nutrición. Ayudo a personas a alcanzar sus metas. Amante de la vida saludable 🏋️‍♀️',
      interests: ['Fitness', 'Nutrición', 'Wellness', 'Playa', 'Yoga'],
      tier: 'gold',
      subscriptionPrice: 14.99,
      isVerified: true,
      followerCount: '8.3K'
    },
    {
      id: 3,
      username: 'luna_artist',
      displayName: 'Luna Martinez',
      profileImage: '/api/placeholder/300/400',
      age: 22,
      location: 'Austin, TX',
      bio: 'Artista digital y diseñadora. Creo contenido único y colorido. Siempre buscando inspiración 🎨',
      interests: ['Arte Digital', 'Diseño', 'Gaming', 'Anime', 'Café'],
      tier: 'standard',
      subscriptionPrice: 9.99,
      isVerified: false,
      followerCount: '3.2K'
    }
  ];

  useEffect(() => {
    setDateProfiles(mockDateProfiles);
    setCurrentDateProfile(mockDateProfiles[0]);
  }, []);

  const handleDateLike = () => {
    const currentIndex = dateProfiles.findIndex(p => p.id === currentDateProfile.id);
    const nextIndex = (currentIndex + 1) % dateProfiles.length;
    setCurrentDateProfile(dateProfiles[nextIndex]);
  };

  const handleDatePass = () => {
    const currentIndex = dateProfiles.findIndex(p => p.id === currentDateProfile.id);
    const nextIndex = (currentIndex + 1) % dateProfiles.length;
    setCurrentDateProfile(dateProfiles[nextIndex]);
  };

  const DateCard = ({ profile }) => (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden max-w-sm w-full">
      {/* Imagen principal */}
      <div className="relative h-80 bg-gradient-to-br from-purple-600 to-pink-600">
        <img 
          src={profile?.profileImage || '/api/placeholder/300/400'} 
          alt={profile?.displayName}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay con información básica */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white text-xl font-bold">{profile?.displayName}</h3>
            {profile?.isVerified && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>{profile?.age} años</span>
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{profile?.location}</span>
            </div>
          </div>
        </div>

        {/* Badge de tier */}
        {profile?.tier && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              profile.tier === 'premium' ? 'bg-purple-600 text-white' :
              profile.tier === 'gold' ? 'bg-yellow-500 text-black' :
              'bg-gray-600 text-white'
            }`}>
              CREATOR
            </span>
          </div>
        )}
      </div>

      {/* Información detallada */}
      <div className="p-6">
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {profile?.bio}
        </p>

        {/* Intereses */}
        <div className="mb-6">
          <h4 className="text-white text-sm font-semibold mb-2">Intereses</h4>
          <div className="flex flex-wrap gap-2">
            {profile?.interests?.map((interest, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full border border-purple-500/30"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <button 
            onClick={handleDatePass}
            className="flex-1 bg-gray-600/50 hover:bg-gray-600/70 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <X size={20} />
            Pass
          </button>
          
          <button 
            onClick={handleDateLike}
            className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Heart size={20} />
            Like
          </button>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="w-64 bg-black/40 backdrop-blur-sm h-screen sticky top-0 border-r border-purple-500/20">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            PXTards
          </h1>
          <Flame className="text-purple-400" size={20} />
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'home' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <Home size={20} />
            <span>Inicio</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('trending')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'trending' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <TrendingUp size={20} />
            <span>Tendencias</span>
          </button>

          {/* SECCIÓN: Date */}
          <button 
            onClick={() => setActiveTab('date')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'date' 
                ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white' 
                : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <Zap size={20} />
            <span>Date</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              ✨
            </span>
          </button>
          
          <button 
            onClick={() => setActiveTab('premium')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'premium' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <Crown size={20} />
            <span>Premium</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'messages' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <Mail size={20} />
            <span>Mensajes</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <Bell size={20} />
            <span>Notificaciones</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('bookmarks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'bookmarks' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <Bookmark size={20} />
            <span>Guardados</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'profile' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-purple-900/50 hover:text-white'
            }`}
          >
            <User size={20} />
            <span>Perfil</span>
          </button>
        </nav>
      </div>

      {/* User info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <p className="text-white font-medium">{user?.displayName || user?.username}</p>
            <p className="text-gray-400 text-sm">@{user?.username}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  const RightSidebar = () => (
    <div className="w-80 bg-black/40 backdrop-blur-sm h-screen sticky top-0 border-l border-purple-500/20">
      <div className="p-6">
        {/* Barra de búsqueda */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar creadores..."
            className="w-full bg-black/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Creadores sugeridos */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-4">Creadores Populares</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">@creator{index + 1}</p>
                  <p className="text-gray-400 text-xs">1.2k seguidores</p>
                </div>
                <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                  Seguir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promoción Premium */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="text-yellow-400" size={20} />
            <h3 className="text-white font-semibold">¡Hazte Premium!</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Accede a contenido exclusivo y funciones premium
          </p>
          <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-2 rounded-lg font-semibold hover:from-yellow-700 hover:to-yellow-600 transition-all">
            Mejorar Cuenta
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800">
      <div className="flex">
        {/* Sidebar izquierdo */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1 max-w-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-black/60 backdrop-blur-md border-b border-purple-500/20 p-4 z-10">
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'home' && 'Inicio'}
              {activeTab === 'trending' && 'Tendencias'}
              {activeTab === 'date' && 'Date - Conecta con Creadores'}
              {activeTab === 'premium' && 'Premium'}
              {activeTab === 'messages' && 'Mensajes'}
              {activeTab === 'notifications' && 'Notificaciones'}
              {activeTab === 'bookmarks' && 'Guardados'}
              {activeTab === 'profile' && 'Perfil'}
            </h2>
          </div>

          {/* Contenido dinámico */}
          <div className="p-4">
            {/* Feed principal - NUEVA INTEGRACIÓN */}
            {activeTab === 'home' && (
              <FeedSection user={user} />
            )}

            {activeTab === 'trending' && (
              <div className="text-center py-20">
                <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Tendencias</h3>
                <p className="text-gray-400">Descubre el contenido más popular</p>
              </div>
            )}

            {/* Date - Funcionalidad existente */}
            {activeTab === 'date' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Conecta con Creadores
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Descubre perfiles de creators increíbles. 
                    Dale like para mostrar interés o pass para continuar.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 justify-center">
                    <div className="flex items-center gap-1">
                      <Heart size={16} className="text-red-400" />
                      <span>Like para conectar</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <X size={16} className="text-gray-400" />
                      <span>Pass para continuar</span>
                    </div>
                  </div>
                </div>

                {/* Tarjeta de perfil principal */}
                <div className="flex justify-center">
                  <DateCard profile={currentDateProfile} />
                </div>

                {/* Controles adicionales */}
                <div className="mt-6 flex justify-center gap-4">
                  <button className="bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white p-3 rounded-full transition-all border border-gray-600/30">
                    <Info size={20} />
                  </button>
                  <button className="bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white p-3 rounded-full transition-all border border-gray-600/30">
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'premium' && (
              <div className="text-center py-20">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Contenido Premium</h3>
                <p className="text-gray-400">Accede a contenido exclusivo</p>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="text-center py-20">
                <Mail className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Mensajes</h3>
                <p className="text-gray-400">Tus conversaciones privadas</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="text-center py-20">
                <Bell className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Notificaciones</h3>
                <p className="text-gray-400">Mantente al día con las últimas novedades</p>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="text-center py-20">
                <Bookmark className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Contenido Guardado</h3>
                <p className="text-gray-400">Tus posts favoritos guardados</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="text-center py-20">
                <User className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Tu Perfil</h3>
                <p className="text-gray-400">Gestiona tu información personal</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar derecho */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
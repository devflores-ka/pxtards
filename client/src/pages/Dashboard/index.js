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
  Info,
  Verified
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import FeedSection from '../../components/common/FeedSection';
import SearchUsers from '../../components/common/SearchUsers';

const Dashboard = () => {
  const navigate = useNavigate();
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
      bio: 'Artista digital y diseñadora. Creo contenido único y colorido. Amante del café y los atardeceres 🎨',
      interests: ['Arte', 'Diseño', 'Ilustración', 'Café', 'Naturaleza'],
      tier: 'creator',
      subscriptionPrice: 9.99,
      isVerified: false,
      followerCount: '5.2K'
    }
  ];

  useEffect(() => {
    setDateProfiles(mockDateProfiles);
    setCurrentDateProfile(mockDateProfiles[0]);
  }, []);

  const handleDateLike = () => {
    console.log('❤️ Like para:', currentDateProfile?.username);
    // Aquí iría la lógica para dar like
    loadNextProfile();
  };

  const handleDatePass = () => {
    console.log('👎 Pass para:', currentDateProfile?.username);
    // Aquí iría la lógica para hacer pass
    loadNextProfile();
  };

  const loadNextProfile = () => {
    const currentIndex = dateProfiles.findIndex(p => p.id === currentDateProfile?.id);
    const nextIndex = (currentIndex + 1) % dateProfiles.length;
    setCurrentDateProfile(dateProfiles[nextIndex]);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user?.username}`);
  };

  const DateCard = ({ profile }) => (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden max-w-sm mx-auto">
      {/* Image */}
      <div className="relative h-96 bg-gradient-to-br from-purple-600 to-pink-600">
        <img 
          src={profile?.profileImage} 
          alt={profile?.displayName}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white text-xl font-bold">
              {profile?.displayName}, {profile?.age}
            </h3>
            {profile?.isVerified && (
              <Verified className="text-blue-400" size={20} />
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              profile?.tier === 'premium' ? 'bg-purple-600 text-white' :
              profile?.tier === 'gold' ? 'bg-yellow-500 text-black' :
              'bg-gray-600 text-white'
            }`}>
              CREATOR
            </span>
          </div>
        </div>
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
            <span>Dating</span>
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
            onClick={handleProfileClick}
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
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.displayName || user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={16} />
            )}
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
        <div className="mb-6">
          <SearchUsers placeholder="Buscar creadores..." />
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
        <div className="flex-1 min-h-screen">
          <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Content based on active tab */}
            {activeTab === 'home' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Tu Feed</h2>
                <FeedSection />
              </div>
            )}

            {activeTab === 'trending' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Dating</h2>
                <div className="flex justify-center">
                  <DateCard profile={currentDateProfile} />
                </div>
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
          </div>
        </div>

        {/* Sidebar derecho */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
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
  Zap, // Nuevo icono para Date
  X,   // Para el botón de "pass"
  MapPin, // Para ubicación
  Info    // Para información adicional
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  // Nuevo estado para la funcionalidad de Date
  const [currentDateProfile, setCurrentDateProfile] = useState(null);
  const [dateProfiles, setDateProfiles] = useState([]);

  // Mock data para posts
  const mockPosts = [
    {
      id: 1,
      user: {
        username: 'bella_model',
        displayName: 'Bella ✨',
        avatar: '/api/placeholder/40/40',
        isVerified: true,
        isCreator: true,
        tier: 'premium'
      },
      content: 'Nueva sesión de fotos disponible 📸 ¡Solo para mis suscriptores VIP!',
      timestamp: '2h',
      likes: 234,
      comments: 45,
      shares: 12,
      isLiked: false,
      isBookmarked: false,
      isPremium: true,
      price: 15.99,
      media: [
        { type: 'image', url: '/api/placeholder/400/300', thumbnail: '/api/placeholder/200/150' }
      ]
    },
    {
      id: 2,
      user: {
        username: 'fitness_sarah',
        displayName: 'Sarah Fitness',
        avatar: '/api/placeholder/40/40',
        isVerified: true,
        isCreator: true,
        tier: 'gold'
      },
      content: 'Rutina de entrenamiento completa 💪 Acceso exclusivo para mis seguidores',
      timestamp: '4h',
      likes: 189,
      comments: 32,
      shares: 8,
      isLiked: true,
      isBookmarked: false,
      isPremium: false,
      media: [
        { type: 'video', url: '/api/placeholder/400/300', thumbnail: '/api/placeholder/200/150' }
      ]
    },
    {
      id: 3,
      user: {
        username: 'artist_luna',
        displayName: 'Luna Art 🎨',
        avatar: '/api/placeholder/40/40',
        isVerified: false,
        isCreator: true,
        tier: 'standard'
      },
      content: 'Nuevo artwork terminado! ¿Qué les parece? 🎨✨',
      timestamp: '6h',
      likes: 156,
      comments: 28,
      shares: 15,
      isLiked: false,
      isBookmarked: true,
      isPremium: false,
      media: [
        { type: 'image', url: '/api/placeholder/400/300', thumbnail: '/api/placeholder/200/150' }
      ]
    }
  ];

  // Mock data para perfiles de Date
  const mockDateProfiles = [
    {
      id: 1,
      name: 'Isabella',
      age: 24,
      profession: 'Modelo & Content Creator',
      location: 'Madrid, España',
      bio: 'Amante del arte y la fotografía. Creando contenido único para mis fans. 📸✨',
      images: [
        '/api/placeholder/400/600',
        '/api/placeholder/400/600',
        '/api/placeholder/400/600'
      ],
      isCreator: true,
      tier: 'premium',
      isVerified: true,
      interests: ['Fotografía', 'Moda', 'Viajes', 'Arte'],
      distance: '2 km'
    },
    {
      id: 2,
      name: 'Sophia',
      age: 26,
      profession: 'Fitness Instructor',
      location: 'Barcelona, España',
      bio: 'Entrenadora personal certificada. Ayudo a crear la mejor versión de ti mismo 💪',
      images: [
        '/api/placeholder/400/600',
        '/api/placeholder/400/600',
        '/api/placeholder/400/600'
      ],
      isCreator: true,
      tier: 'gold',
      isVerified: true,
      interests: ['Fitness', 'Nutrición', 'Bienestar', 'Yoga'],
      distance: '5 km'
    },
    {
      id: 3,
      name: 'Luna',
      age: 22,
      profession: 'Artista Digital',
      location: 'Valencia, España',
      bio: 'Creando mundos digitales y experiencias únicas. Arte que conecta almas 🎨',
      images: [
        '/api/placeholder/400/600',
        '/api/placeholder/400/600',
        '/api/placeholder/400/600'
      ],
      isCreator: true,
      tier: 'standard',
      isVerified: false,
      interests: ['Arte Digital', 'Gaming', 'Anime', 'Música'],
      distance: '8 km'
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
    setDateProfiles(mockDateProfiles);
    if (mockDateProfiles.length > 0) {
      setCurrentDateProfile(mockDateProfiles[0]);
    }
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  // Funciones para la funcionalidad de Date
  const handleDateLike = () => {
    if (currentDateProfile) {
      // Aquí iría la lógica para hacer "like" en el perfil
      console.log('Like a:', currentDateProfile.name);
      nextProfile();
    }
  };

  const handleDatePass = () => {
    if (currentDateProfile) {
      // Aquí iría la lógica para hacer "pass" en el perfil
      console.log('Pass a:', currentDateProfile.name);
      nextProfile();
    }
  };

  const nextProfile = () => {
    const currentIndex = dateProfiles.findIndex(profile => profile.id === currentDateProfile?.id);
    const nextIndex = (currentIndex + 1) % dateProfiles.length;
    setCurrentDateProfile(dateProfiles[nextIndex]);
  };

  const PostCard = ({ post }) => (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-500/20 hover:border-purple-400/40 transition-all">
      {/* Header del post */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">{post.user.displayName}</h3>
              {post.user.isVerified && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
              {post.user.isCreator && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  post.user.tier === 'premium' ? 'bg-yellow-600 text-black' :
                  post.user.tier === 'gold' ? 'bg-yellow-500 text-black' :
                  'bg-purple-600 text-white'
                }`}>
                  {post.user.tier.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">@{post.user.username} • {post.timestamp}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Contenido del post */}
      <p className="text-white mb-4">{post.content}</p>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.isPremium ? (
            <div className="relative">
              <div className="bg-black/80 backdrop-blur-sm p-8 rounded-lg border border-yellow-500/30 text-center">
                <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Contenido Premium</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Suscríbete para acceder a este contenido exclusivo
                </p>
                <div className="flex items-center justify-center gap-2 text-yellow-400 font-semibold">
                  <DollarSign size={16} />
                  <span>${post.price}</span>
                </div>
              </div>
            </div>
          ) : (
            <img 
              src={post.media[0].url} 
              alt="Post content" 
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-2 transition-colors ${
              post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likes}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm">{post.shares}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleBookmark(post.id)}
            className={`transition-colors ${
              post.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </button>
          
          {post.isPremium && (
            <button className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{post.price}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Nuevo componente para la funcionalidad de Date
  const DateCard = ({ profile }) => {
    if (!profile) return null;

    return (
      <div className="max-w-md mx-auto bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl">
        {/* Imagen principal */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={profile.images[0]} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay con información básica */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-white text-2xl font-bold">{profile.name}</h2>
              <span className="text-white text-xl">{profile.age}</span>
              {profile.isVerified && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
            </div>
            
            <p className="text-gray-200 text-sm mb-1">{profile.profession}</p>
            
            <div className="flex items-center gap-1 text-gray-300 text-sm">
              <MapPin size={14} />
              <span>{profile.location} • {profile.distance}</span>
            </div>
          </div>

          {/* Badge de creator */}
          {profile.isCreator && (
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                profile.tier === 'premium' ? 'bg-yellow-600 text-black' :
                profile.tier === 'gold' ? 'bg-yellow-500 text-black' :
                'bg-purple-600 text-white'
              }`}>
                CREATOR
              </span>
            </div>
          )}
        </div>

        {/* Información detallada */}
        <div className="p-6">
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {profile.bio}
          </p>

          {/* Intereses */}
          <div className="mb-6">
            <h4 className="text-white text-sm font-semibold mb-2">Intereses</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
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
  };

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

          {/* NUEVA SECCIÓN: Date */}
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

        {/* Botón de crear post */}
        <button 
          onClick={() => setShowPostModal(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold mt-6 transition-all"
        >
          Crear Post
        </button>
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

          {/* Feed */}
          <div className="p-4">
            {activeTab === 'home' && (
              <div>
                {/* Crear post rápido */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <input 
                      type="text"
                      placeholder="¿Qué está pasando?"
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <Image size={20} />
                      </button>
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <Video size={20} />
                      </button>
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <Gift size={20} />
                      </button>
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                      Publicar
                    </button>
                  </div>
                </div>

                {/* Posts */}
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {activeTab === 'trending' && (
              <div className="text-center py-20">
                <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Tendencias</h3>
                <p className="text-gray-400">Descubre el contenido más popular</p>
              </div>
            )}

            {/* NUEVA SECCIÓN: Date */}
            {activeTab === 'date' && (
              <div>
                {/* Header informativo */}
                <div className="bg-gradient-to-r from-pink-600/20 to-red-600/20 border border-pink-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="text-pink-400" size={24} />
                    <h3 className="text-white text-lg font-bold">Descubre Creadores</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Conecta con creadores de contenido increíbles. Dale like para mostrar interés o pass para continuar.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
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
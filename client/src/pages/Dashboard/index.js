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
  Gift
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

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

  useEffect(() => {
    setPosts(mockPosts);
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

  const PostCard = ({ post }) => (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 mb-4 border border-purple-500/20">
      {/* Header del post */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={post.user.avatar} 
              alt={post.user.displayName}
              className="w-12 h-12 rounded-full border-2 border-purple-400"
            />
            {post.user.tier === 'premium' && (
              <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{post.user.displayName}</h3>
              {post.user.isVerified && (
                <Star className="w-4 h-4 text-blue-400 fill-current" />
              )}
              {post.user.isCreator && (
                <Crown className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <p className="text-gray-400 text-sm">@{post.user.username} • {post.timestamp}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Contenido del post */}
      <p className="text-white mb-4">{post.content}</p>

      {/* Media del post */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 relative">
          {post.isPremium && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold mb-1">Contenido Premium</p>
                <p className="text-gray-300 text-sm mb-4">${post.price}</p>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-full text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                  Desbloquear
                </button>
              </div>
            </div>
          )}
          {post.media.map((item, index) => (
            <div key={index} className="rounded-xl overflow-hidden">
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt="Post content"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <video 
                  src={item.url}
                  poster={item.thumbnail}
                  className="w-full h-64 object-cover"
                  controls={!post.isPremium}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Acciones del post */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-2 transition-colors ${
              post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likes}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm">{post.shares}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
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
            className="w-full bg-black/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
          />
        </div>

        {/* Trending Creators */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-4">Creadores Populares</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={`/api/placeholder/40/40`}
                      alt="Creator"
                      className="w-10 h-10 rounded-full border-2 border-purple-400"
                    />
                    <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Creator {i}</p>
                    <p className="text-gray-400 text-xs">@creator{i}</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
                  Seguir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Upgrade */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
          <div className="text-center">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-2">Hazte Premium</h3>
            <p className="text-gray-300 text-sm mb-4">
              Accede a contenido exclusivo y funciones premium
            </p>
            <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-2 rounded-lg font-semibold hover:from-yellow-700 hover:to-yellow-600 transition-all">
              Mejorar Cuenta
            </button>
          </div>
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

            {activeTab === 'premium' && (
              <div className="text-center py-20">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Contenido Premium</h3>
                <p className="text-gray-400">Accede a contenido exclusivo</p>
              </div>
            )}

            {/* Más tabs... */}
          </div>
        </div>

        {/* Sidebar derecho */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
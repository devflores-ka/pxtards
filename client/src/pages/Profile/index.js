// client/src/pages/Profile/index.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Heart, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Link,
  Settings,
  UserPlus,
  UserMinus,
  Verified,
  Crown,
  Grid,
  List,
  Share,
  MoreHorizontal,
  ArrowLeft,
  Loader,
  Camera,
  Edit3,
  Star,
  DollarSign,
  Users,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import usersService from '../../services/usersService';
import Post from '../../components/common/Post';
import EditProfileModal from '../../components/profile/EditProfileModal';
import FollowersModal from '../../components/profile/FollowersModal';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersModalType, setFollowersModalType] = useState('followers'); // 'followers' | 'following'
  const [error, setError] = useState(null);

  // Cargar perfil del usuario
  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar usuario por username
      const response = await usersService.getUserProfileByUsername(username);
      
      setProfile(response.user);
      setIsFollowing(response.user.isFollowing || false);
      
    } catch (error) {
      console.error('Error loading profile:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para seguir usuarios');
      return;
    }

    if (isFollowLoading) return;

    try {
      setIsFollowLoading(true);
      
      let response;
      if (isFollowing) {
        response = await usersService.unfollowUser(profile.id);
        toast.success('Dejaste de seguir al usuario');
      } else {
        response = await usersService.followUser(profile.id);
        toast.success('¡Ahora sigues a este usuario!');
      }
      
      setIsFollowing(response.isFollowing);
      
      // Actualizar contador en el perfil
      setProfile(prev => ({
        ...prev,
        followersCount: prev.followersCount + (response.isFollowing ? 1 : -1)
      }));
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileUpdated = (updatedUser) => {
    setProfile(prev => ({
      ...prev,
      ...updatedUser
    }));
    setShowEditModal(false);
    toast.success('Perfil actualizado correctamente');
  };

  const openFollowersModal = (type) => {
    setFollowersModalType(type);
    setShowFollowersModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Usuario no encontrado</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800">
      {/* Header con botón de volver */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white font-bold">{profile?.displayName || profile?.username}</h1>
            <p className="text-gray-400 text-sm">{formatNumber(profile?.stats?.totalPosts || 0)} posts</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 to-pink-600 rounded-b-xl overflow-hidden">
          {profile?.coverImage ? (
            <img 
              src={profile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600" />
          )}
          
          {/* Profile Image */}
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 bg-black rounded-full p-1">
              <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {profile?.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt={profile.displayName || profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 px-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {profile?.displayName || profile?.username}
                </h1>
                {profile?.isVerified && (
                  <Verified className="text-blue-400" size={20} />
                )}
                {profile?.isCreator && (
                  <Crown className="text-yellow-400" size={20} />
                )}
              </div>
              <p className="text-gray-400">@{profile?.username}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {profile?.isOwnProfile ? (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                  Editar perfil
                </button>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      isFollowing 
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isFollowLoading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : isFollowing ? (
                      <UserMinus size={16} />
                    ) : (
                      <UserPlus size={16} />
                    )}
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                  </button>
                  
                  <button className="bg-gray-600/50 hover:bg-gray-600/70 text-white p-2 rounded-lg transition-colors">
                    <MessageCircle size={16} />
                  </button>
                </>
              )}
              
              <button className="bg-gray-600/50 hover:bg-gray-600/70 text-white p-2 rounded-lg transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Bio */}
          {profile?.bio && (
            <p className="text-gray-300 mb-4 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Creator Info */}
          {profile?.isCreator && (
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                <span>Suscripción: ${profile.subscriptionPrice}/mes</span>
              </div>
            </div>
          )}

          {/* Join Date */}
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
            <Calendar size={14} />
            <span>Se unió en {formatDate(profile?.createdAt)}</span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-6">
            <button
              onClick={() => openFollowersModal('following')}
              className="hover:underline"
            >
              <span className="text-white font-bold">{formatNumber(profile?.followingCount || 0)}</span>
              <span className="text-gray-400 ml-1">siguiendo</span>
            </button>
            
            <button
              onClick={() => openFollowersModal('followers')}
              className="hover:underline"
            >
              <span className="text-white font-bold">{formatNumber(profile?.followersCount || 0)}</span>
              <span className="text-gray-400 ml-1">seguidores</span>
            </button>

            <div>
              <span className="text-white font-bold">{formatNumber(profile?.stats?.totalLikesReceived || 0)}</span>
              <span className="text-gray-400 ml-1">likes</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-purple-500/20 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('posts')}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-purple-400 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid size={16} />
                  Posts
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('media')}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === 'media'
                    ? 'border-purple-400 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Camera size={16} />
                  Media
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('likes')}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === 'likes'
                    ? 'border-purple-400 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart size={16} />
                  Likes
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {profile?.posts && profile.posts.length > 0 ? (
                  profile.posts.map(post => (
                    <Post 
                      key={post.id} 
                      post={{
                        ...post,
                        user: {
                          id: profile.id,
                          username: profile.username,
                          displayName: profile.displayName,
                          profileImage: profile.profileImage,
                          isCreator: profile.isCreator,
                          isVerified: profile.isVerified
                        }
                      }}
                      currentUser={currentUser}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No hay posts aún</h3>
                    <p className="text-gray-400">
                      {profile?.isOwnProfile 
                        ? 'Comparte tu primer post para empezar'
                        : 'Este usuario no ha publicado nada aún'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Contenido multimedia</h3>
                <p className="text-gray-400">Las fotos y videos aparecerán aquí</p>
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Posts que le gustan</h3>
                <p className="text-gray-400">Los posts con like aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          user={profile}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {showFollowersModal && (
        <FollowersModal
          userId={profile?.id}
          type={followersModalType}
          onClose={() => setShowFollowersModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
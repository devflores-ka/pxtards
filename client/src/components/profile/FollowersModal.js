// client/src/components/profile/FollowersModal.js
import React, { useState, useEffect } from 'react';
import { X, User, UserPlus, UserMinus, Verified, Crown, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import usersService from '../../services/usersService';
import { useAuth } from '../../hooks/useAuth';

const FollowersModal = ({ userId, type, onClose }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false
  });
  const [followingStates, setFollowingStates] = useState({});

  const title = type === 'followers' ? 'Seguidores' : 'Siguiendo';

  useEffect(() => {
    loadUsers();
  }, [userId, type]);

  const loadUsers = async (page = 1, append = false) => {
    try {
      if (page === 1 && !append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      let response;
      if (type === 'followers') {
        response = await usersService.getFollowers(userId, page, 20);
        setUsers(append ? prev => [...prev, ...response.followers] : response.followers);
      } else {
        response = await usersService.getFollowing(userId, page, 20);
        setUsers(append ? prev => [...prev, ...response.following] : response.following);
      }

      setPagination(response.pagination);

      // Inicializar estados de following
      const newFollowingStates = {};
      const usersList = type === 'followers' ? response.followers : response.following;
      usersList.forEach(user => {
        newFollowingStates[user.id] = user.isFollowing;
      });
      
      if (append) {
        setFollowingStates(prev => ({ ...prev, ...newFollowingStates }));
      } else {
        setFollowingStates(newFollowingStates);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !isLoadingMore) {
      loadUsers(pagination.currentPage + 1, true);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión');
      return;
    }

    if (targetUserId === currentUser.id) {
      return; // No puede seguirse a sí mismo
    }

    try {
      const isCurrentlyFollowing = followingStates[targetUserId];
      
      // Actualizar UI optimisticamente
      setFollowingStates(prev => ({
        ...prev,
        [targetUserId]: !isCurrentlyFollowing
      }));

      let response;
      if (isCurrentlyFollowing) {
        response = await usersService.unfollowUser(targetUserId);
        toast.success('Dejaste de seguir al usuario');
      } else {
        response = await usersService.followUser(targetUserId);
        toast.success('¡Ahora sigues a este usuario!');
      }

      // Confirmar cambio con respuesta del servidor
      setFollowingStates(prev => ({
        ...prev,
        [targetUserId]: response.isFollowing
      }));

    } catch (error) {
      // Revertir cambio optimista si hay error
      setFollowingStates(prev => ({
        ...prev,
        [targetUserId]: !prev[targetUserId]
      }));
      toast.error(error.message);
    }
  };

  const handleUserClick = (username) => {
    onClose();
    navigate(`/profile/${username}`);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 rounded-xl border border-purple-500/20 w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 text-purple-400 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">
                {type === 'followers' ? 'No hay seguidores aún' : 'No sigue a nadie aún'}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors">
                  {/* Avatar */}
                  <button
                    onClick={() => handleUserClick(user.username)}
                    className="flex-shrink-0"
                  >
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                      {user.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={user.displayName || user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                  </button>

                  {/* User Info */}
                  <button
                    onClick={() => handleUserClick(user.username)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        {user.displayName || user.username}
                      </span>
                      {user.isVerified && (
                        <Verified className="text-blue-400" size={14} />
                      )}
                      {user.isCreator && (
                        <Crown className="text-yellow-400" size={14} />
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      <span>@{user.username}</span>
                      <span className="mx-2">•</span>
                      <span>{formatNumber(user.followersCount)} seguidores</span>
                    </div>
                  </button>

                  {/* Follow Button */}
                  {currentUser && user.id !== currentUser.id && (
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        followingStates[user.id]
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {followingStates[user.id] ? (
                        <div className="flex items-center gap-1">
                          <UserMinus size={14} />
                          <span className="hidden sm:inline">Siguiendo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <UserPlus size={14} />
                          <span className="hidden sm:inline">Seguir</span>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              ))}

              {/* Load More Button */}
              {pagination.hasNextPage && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="bg-purple-600/50 hover:bg-purple-600/70 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      'Cargar más'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
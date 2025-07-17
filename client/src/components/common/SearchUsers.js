// client/src/components/common/SearchUsers.js
import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Verified, Crown, UserPlus, UserMinus, Loader, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import usersService from '../../services/usersService';
import { useAuth } from '../../hooks/useAuth';

const SearchUsers = ({ placeholder = "Buscar usuarios..." }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [followingStates, setFollowingStates] = useState({});
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target) &&
        resultsRef.current && !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async () => {
    if (query.trim().length < 2) return;

    try {
      setIsLoading(true);
      const response = await usersService.searchUsers(query.trim(), 1, 10);
      
      setResults(response.users);
      setShowResults(true);

      // Inicializar estados de following
      const states = {};
      response.users.forEach(user => {
        states[user.id] = user.isFollowing;
      });
      setFollowingStates(states);

    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Error al buscar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (username) => {
    setQuery('');
    setShowResults(false);
    navigate(`/profile/${username}`);
  };

  const handleFollowToggle = async (userId, event) => {
    event.stopPropagation(); // Prevenir navegación al perfil

    if (!currentUser) {
      toast.error('Debes iniciar sesión');
      return;
    }

    if (userId === currentUser.id) {
      return; // No puede seguirse a sí mismo
    }

    try {
      const isCurrentlyFollowing = followingStates[userId];
      
      // Actualizar UI optimisticamente
      setFollowingStates(prev => ({
        ...prev,
        [userId]: !isCurrentlyFollowing
      }));

      // Actualizar contador en la lista local
      setResults(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, followersCount: user.followersCount + (!isCurrentlyFollowing ? 1 : -1) }
          : user
      ));

      let response;
      if (isCurrentlyFollowing) {
        response = await usersService.unfollowUser(userId);
        toast.success('Dejaste de seguir al usuario');
      } else {
        response = await usersService.followUser(userId);
        toast.success('¡Ahora sigues a este usuario!');
      }

      // Confirmar cambio con respuesta del servidor
      setFollowingStates(prev => ({
        ...prev,
        [userId]: response.isFollowing
      }));

    } catch (error) {
      // Revertir cambio optimista si hay error
      setFollowingStates(prev => ({
        ...prev,
        [userId]: !prev[userId]
      }));
      
      setResults(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, followersCount: user.followersCount + (followingStates[userId] ? 1 : -1) }
          : user
      ));
      
      toast.error(error.message);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div ref={searchRef} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder}
          className="w-full bg-black/50 border border-purple-500/30 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
        />
        
        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader className="w-4 h-4 text-purple-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-sm border border-purple-500/20 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
        >
          {results.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user.username)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition-colors text-left"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.displayName || user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white truncate">
                        {user.displayName || user.username}
                      </span>
                      {user.isVerified && (
                        <Verified className="text-blue-400 flex-shrink-0" size={14} />
                      )}
                      {user.isCreator && (
                        <Crown className="text-yellow-400 flex-shrink-0" size={14} />
                      )}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      <span>@{user.username}</span>
                      <span className="mx-2">•</span>
                      <span>{formatNumber(user.followersCount)} seguidores</span>
                    </div>
                    {user.bio && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {/* Follow Button */}
                  {currentUser && user.id !== currentUser.id && (
                    <button
                      onClick={(e) => handleFollowToggle(user.id, e)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        followingStates[user.id]
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {followingStates[user.id] ? (
                        <div className="flex items-center gap-1">
                          <UserMinus size={12} />
                          <span className="hidden sm:inline">Siguiendo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <UserPlus size={12} />
                          <span className="hidden sm:inline">Seguir</span>
                        </div>
                      )}
                    </button>
                  )}
                </button>
              ))}

              {/* Show more link */}
              {results.length >= 10 && (
                <button
                  onClick={() => {
                    setShowResults(false);
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="w-full p-3 text-center text-purple-400 hover:text-purple-300 text-sm transition-colors"
                >
                  Ver todos los resultados para "{query}"
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
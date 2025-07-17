// client/src/services/usersService.js
import api from '../utils/api';
import { API_ENDPOINTS } from '../config/api';

class UsersService {
  // Obtener perfil público de usuario por username
  async getUserProfileByUsername(username) {
    try {
      console.log(`👤 Fetching profile for username: ${username}`);
      
      const response = await api.get(`/users/username/${username}`);
      
      console.log('✅ User profile loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al cargar el perfil del usuario'
      );
    }
  }

  // Obtener perfil público de usuario por ID
  async getUserProfile(userId) {
    try {
      console.log(`👤 Fetching profile for user: ${userId}`);
      
      const response = await api.get(API_ENDPOINTS.USERS.PROFILE(userId));
      
      console.log('✅ User profile loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al cargar el perfil del usuario'
      );
    }
  }

  // Actualizar perfil del usuario actual
  async updateProfile(profileData) {
    try {
      console.log('✏️ Updating profile:', profileData);
      
      const response = await api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      
      console.log('✅ Profile updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw new Error(
        error.response?.data?.details?.join(', ') ||
        error.response?.data?.message || 
        'Error al actualizar el perfil'
      );
    }
  }

  // Seguir a un usuario
  async followUser(userId) {
    try {
      console.log(`👥 Following user: ${userId}`);
      
      const response = await api.post(API_ENDPOINTS.USERS.FOLLOW(userId));
      
      console.log('✅ User followed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error following user:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al seguir al usuario'
      );
    }
  }

  // Dejar de seguir a un usuario
  async unfollowUser(userId) {
    try {
      console.log(`👥 Unfollowing user: ${userId}`);
      
      const response = await api.delete(API_ENDPOINTS.USERS.UNFOLLOW(userId));
      
      console.log('✅ User unfollowed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error unfollowing user:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al dejar de seguir al usuario'
      );
    }
  }

  // Obtener seguidores de un usuario
  async getFollowers(userId, page = 1, limit = 20) {
    try {
      console.log(`👥 Fetching followers for user: ${userId}`);
      
      const response = await api.get(`${API_ENDPOINTS.USERS.FOLLOWERS(userId)}?page=${page}&limit=${limit}`);
      
      console.log('✅ Followers loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching followers:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al cargar los seguidores'
      );
    }
  }

  // Obtener usuarios que sigue
  async getFollowing(userId, page = 1, limit = 20) {
    try {
      console.log(`👥 Fetching following for user: ${userId}`);
      
      const response = await api.get(`${API_ENDPOINTS.USERS.FOLLOWING(userId)}?page=${page}&limit=${limit}`);
      
      console.log('✅ Following loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching following:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al cargar los usuarios seguidos'
      );
    }
  }

  // Buscar usuarios
  async searchUsers(query, page = 1, limit = 20) {
    try {
      console.log(`🔍 Searching users with query: ${query}`);
      
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      
      console.log('✅ Users search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error searching users:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al buscar usuarios'
      );
    }
  }

  // Validar datos de perfil
  validateProfileData(profileData) {
    const errors = [];

    if (profileData.displayName && (profileData.displayName.length < 2 || profileData.displayName.length > 100)) {
      errors.push('El nombre debe tener entre 2 y 100 caracteres');
    }

    if (profileData.bio && profileData.bio.length > 500) {
      errors.push('La biografía no puede exceder 500 caracteres');
    }

    if (profileData.subscriptionPrice && (profileData.subscriptionPrice < 0 || profileData.subscriptionPrice > 99.99)) {
      errors.push('El precio de suscripción debe estar entre $0 y $99.99');
    }

    if (profileData.profileImage && !this.isValidUrl(profileData.profileImage)) {
      errors.push('La URL de la imagen de perfil no es válida');
    }

    if (profileData.coverImage && !this.isValidUrl(profileData.coverImage)) {
      errors.push('La URL de la imagen de portada no es válida');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar URL
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Formatear datos de usuario para la UI
  formatUserForUI(user) {
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      isCreator: user.isCreator,
      isVerified: user.isVerified,
      subscriptionPrice: user.subscriptionPrice,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
      isFollowing: user.isFollowing,
      isOwnProfile: user.isOwnProfile,
      stats: user.stats,
      posts: user.posts || []
    };
  }

  // Formatear número de seguidores
  formatFollowersCount(count) {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  // Generar URL de perfil
  getProfileUrl(username) {
    return `/profile/${username}`;
  }

  // Cache simple para perfiles
  #profileCache = new Map();
  #cacheTimeout = 5 * 60 * 1000; // 5 minutos

  async getCachedUserProfile(userId, forceRefresh = false) {
    const now = Date.now();
    
    if (!forceRefresh && this.#profileCache.has(userId)) {
      const cached = this.#profileCache.get(userId);
      if (now - cached.timestamp < this.#cacheTimeout) {
        console.log('📦 Using cached user profile');
        return cached.data;
      }
    }

    const profileData = await this.getUserProfile(userId);
    
    this.#profileCache.set(userId, {
      data: profileData,
      timestamp: now
    });

    return profileData;
  }

  // Limpiar cache de perfil
  clearProfileCache(userId = null) {
    if (userId) {
      this.#profileCache.delete(userId);
    } else {
      this.#profileCache.clear();
    }
  }

  // Actualizar datos en cache después de follow/unfollow
  updateFollowStatusInCache(userId, isFollowing) {
    if (this.#profileCache.has(userId)) {
      const cached = this.#profileCache.get(userId);
      if (cached.data.user) {
        cached.data.user.isFollowing = isFollowing;
        cached.data.user.followersCount += isFollowing ? 1 : -1;
      }
    }
  }
}

// Exportar instancia singleton
const usersService = new UsersService();
export default usersService;
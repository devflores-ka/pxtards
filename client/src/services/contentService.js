// client/src/services/contentService.js
import api from '../utils/api';

// Endpoints específicos para contenido
const CONTENT_ENDPOINTS = {
  FEED: '/content/feed',
  POSTS: '/content/posts',
  POST: (postId) => `/content/posts/${postId}`,
  LIKE: (postId) => `/content/posts/${postId}/like`
};

class ContentService {
  // Obtener feed de posts
  async getFeed(page = 1, limit = 10) {
    try {
      console.log(`📱 Fetching feed - page: ${page}, limit: ${limit}`);
      
      const response = await api.get(`${CONTENT_ENDPOINTS.FEED}?page=${page}&limit=${limit}`);
      
      console.log('✅ Feed loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching feed:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al cargar el feed'
      );
    }
  }

  // Crear nuevo post
  async createPost(postData) {
    try {
      console.log('📝 Creating post:', postData);
      
      // Transformar los datos al formato que espera el backend
      const backendData = {
        title: postData.title,
        description: postData.description,
        content_type: postData.contentType,
        is_premium: postData.isPremium,
        price: postData.price
      };
      
      // Solo agregar campos URL si tienen valores válidos
      if (postData.mediaUrl && postData.mediaUrl.trim() !== '') {
        backendData.media_url = postData.mediaUrl;
      }
      
      if (postData.thumbnailUrl && postData.thumbnailUrl.trim() !== '') {
        backendData.thumbnail_url = postData.thumbnailUrl;
      }
      
      console.log('📝 Sending to backend:', backendData);
      
      const response = await api.post(CONTENT_ENDPOINTS.POSTS, backendData);
      
      console.log('✅ Post created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating post:', error);
      console.error('❌ Error details:', error.response?.data);
      throw new Error(
        error.response?.data?.details?.join(', ') ||
        error.response?.data?.message || 
        'Error al crear el post'
      );
    }
  }

  // Dar/quitar like a un post
  async toggleLike(postId) {
    try {
      console.log(`❤️ Toggling like for post: ${postId}`);
      
      const response = await api.post(CONTENT_ENDPOINTS.LIKE(postId));
      
      console.log('✅ Like toggled:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al procesar el like'
      );
    }
  }

  // Obtener post específico
  async getPost(postId) {
    try {
      console.log(`📄 Fetching post: ${postId}`);
      
      const response = await api.get(CONTENT_ENDPOINTS.POST(postId));
      
      console.log('✅ Post loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching post:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al cargar el post'
      );
    }
  }

  // Eliminar post
  async deletePost(postId) {
    try {
      console.log(`🗑️ Deleting post: ${postId}`);
      
      const response = await api.delete(CONTENT_ENDPOINTS.POST(postId));
      
      console.log('✅ Post deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al eliminar el post'
      );
    }
  }

  // Formatear datos de post para la UI
  formatPostForUI(post) {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      contentType: post.contentType,
      mediaUrl: post.mediaUrl,
      thumbnailUrl: post.thumbnailUrl,
      price: post.price,
      isPremium: post.isPremium,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      viewsCount: post.viewsCount,
      userLiked: post.userLiked,
      createdAt: new Date(post.createdAt),
      user: {
        id: post.user.id,
        username: post.user.username,
        displayName: post.user.displayName,
        profileImage: post.user.profileImage,
        isCreator: post.user.isCreator,
        isVerified: post.user.isVerified
      }
    };
  }

  // Formatear tiempo relativo (ej: "hace 2 horas")
  formatTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'ahora';
    if (diffInMins < 60) return `hace ${diffInMins}m`;
    if (diffInHours < 24) return `hace ${diffInHours}h`;
    if (diffInDays < 7) return `hace ${diffInDays}d`;
    
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  }

  // Validar datos de post antes de enviar
  validatePostData(postData) {
    const errors = [];

    if (!postData.description || postData.description.trim().length === 0) {
      errors.push('La descripción es requerida');
    }

    if (postData.description && postData.description.length > 2000) {
      errors.push('La descripción no puede exceder 2000 caracteres');
    }

    if (postData.title && postData.title.length > 255) {
      errors.push('El título no puede exceder 255 caracteres');
    }

    if (postData.price && (postData.price < 0 || postData.price > 999.99)) {
      errors.push('El precio debe estar entre $0 y $999.99');
    }

    if (postData.contentType && !['text', 'image', 'video'].includes(postData.contentType)) {
      errors.push('Tipo de contenido no válido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Cache simple para el feed (opcional)
  #feedCache = null;
  #lastFetchTime = null;
  #cacheTimeout = 5 * 60 * 1000; // 5 minutos

  async getCachedFeed(page = 1, limit = 10, forceRefresh = false) {
    const now = Date.now();
    
    // Solo usar cache para la primera página
    if (page === 1 && !forceRefresh && this.#feedCache && 
        this.#lastFetchTime && (now - this.#lastFetchTime) < this.#cacheTimeout) {
      console.log('📦 Using cached feed');
      return this.#feedCache;
    }

    const feedData = await this.getFeed(page, limit);
    
    if (page === 1) {
      this.#feedCache = feedData;
      this.#lastFetchTime = now;
    }

    return feedData;
  }

  // Limpiar cache
  clearCache() {
    this.#feedCache = null;
    this.#lastFetchTime = null;
  }
}

// Exportar instancia singleton
const contentService = new ContentService();
export default contentService;
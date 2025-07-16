// client/src/services/commentsService.js
import api from '../utils/api';

// Endpoints específicos para comentarios
const COMMENTS_ENDPOINTS = {
  POST_COMMENTS: (postId) => `/comments/post/${postId}`,
  COMMENT: (commentId) => `/comments/${commentId}`,
  LIKE_COMMENT: (commentId) => `/comments/${commentId}/like`
};

class CommentsService {
  // Obtener comentarios de un post
  async getComments(postId, page = 1, limit = 20) {
    try {
      console.log(`💬 Fetching comments for post: ${postId}, page: ${page}`);
      
      const response = await api.get(`${COMMENTS_ENDPOINTS.POST_COMMENTS(postId)}?page=${page}&limit=${limit}`);
      
      console.log('✅ Comments loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al cargar los comentarios'
      );
    }
  }

  // Crear nuevo comentario
  async createComment(postId, commentData) {
    try {
      console.log('💬 Creating comment:', { postId, commentData });
      
      const response = await api.post(COMMENTS_ENDPOINTS.POST_COMMENTS(postId), commentData);
      
      console.log('✅ Comment created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating comment:', error);
      throw new Error(
        error.response?.data?.details?.join(', ') ||
        error.response?.data?.message || 
        'Error al crear el comentario'
      );
    }
  }

  // Editar comentario
  async editComment(commentId, content) {
    try {
      console.log('✏️ Editing comment:', { commentId, content });
      
      const response = await api.put(COMMENTS_ENDPOINTS.COMMENT(commentId), { content });
      
      console.log('✅ Comment edited:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error editing comment:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al editar el comentario'
      );
    }
  }

  // Eliminar comentario
  async deleteComment(commentId) {
    try {
      console.log('🗑️ Deleting comment:', commentId);
      
      const response = await api.delete(COMMENTS_ENDPOINTS.COMMENT(commentId));
      
      console.log('✅ Comment deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al eliminar el comentario'
      );
    }
  }

  // Dar/quitar like a un comentario
  async toggleLike(commentId) {
    try {
      console.log(`❤️ Toggling like for comment: ${commentId}`);
      
      const response = await api.post(COMMENTS_ENDPOINTS.LIKE_COMMENT(commentId));
      
      console.log('✅ Comment like toggled:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error toggling comment like:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al procesar el like'
      );
    }
  }

  // Formatear comentario para la UI
  formatCommentForUI(comment) {
    return {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      parentId: comment.parentId,
      level: comment.level || 1,
      likesCount: comment.likesCount,
      userLiked: comment.userLiked,
      createdAt: new Date(comment.createdAt),
      updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : null,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        displayName: comment.user.displayName,
        profileImage: comment.user.profileImage,
        isCreator: comment.user.isCreator,
        isVerified: comment.user.isVerified
      }
    };
  }

  // Formatear tiempo relativo para comentarios
  formatTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'ahora';
    if (diffInMins < 60) return `${diffInMins}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  }

  // Validar contenido del comentario
  validateComment(content) {
    const errors = [];

    if (!content || content.trim().length === 0) {
      errors.push('El comentario no puede estar vacío');
    }

    if (content && content.length > 1000) {
      errors.push('El comentario no puede exceder 1000 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Organizar comentarios en árbol jerárquico
  organizeCommentsTree(comments) {
    const commentMap = new Map();
    const rootComments = [];

    // Crear mapa de comentarios
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Organizar en árbol
    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return rootComments;
  }

  // Contar total de comentarios incluyendo respuestas
  countTotalComments(comments) {
    let total = 0;
    
    const countRecursive = (commentsList) => {
      commentsList.forEach(comment => {
        total++;
        if (comment.replies && comment.replies.length > 0) {
          countRecursive(comment.replies);
        }
      });
    };

    countRecursive(comments);
    return total;
  }

  // Cache simple para comentarios
  #commentsCache = new Map();
  #cacheTimeout = 2 * 60 * 1000; // 2 minutos

  async getCachedComments(postId, page = 1, limit = 20, forceRefresh = false) {
    const cacheKey = `${postId}-${page}-${limit}`;
    const now = Date.now();
    
    if (!forceRefresh && this.#commentsCache.has(cacheKey)) {
      const cached = this.#commentsCache.get(cacheKey);
      if (now - cached.timestamp < this.#cacheTimeout) {
        console.log('📦 Using cached comments');
        return cached.data;
      }
    }

    const commentsData = await this.getComments(postId, page, limit);
    
    this.#commentsCache.set(cacheKey, {
      data: commentsData,
      timestamp: now
    });

    return commentsData;
  }

  // Limpiar cache de comentarios
  clearCache(postId = null) {
    if (postId) {
      // Limpiar solo cache de un post específico
      for (const key of this.#commentsCache.keys()) {
        if (key.startsWith(`${postId}-`)) {
          this.#commentsCache.delete(key);
        }
      }
    } else {
      // Limpiar todo el cache
      this.#commentsCache.clear();
    }
  }
}

// Exportar instancia singleton
const commentsService = new CommentsService();
export default commentsService;
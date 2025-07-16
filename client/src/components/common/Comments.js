// client/src/components/common/Comments.js
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal, 
  Send, 
  Edit, 
  Trash2, 
  Reply,
  Verified,
  Loader,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import commentsService from '../../services/commentsService';

const Comments = ({ postId, currentUser, initialCommentsCount = 0, onCommentsCountChange, showComments, onToggleComments }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    totalComments: initialCommentsCount
  });

  // Función para mostrar errores
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Cargar comentarios inicial
  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, postId]);

  const loadComments = async (page = 1, append = false) => {
    try {
      if (page === 1 && !append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await commentsService.getComments(postId, page, 20);
      
      if (append) {
        setComments(prev => [...prev, ...response.comments]);
      } else {
        setComments(response.comments);
      }
      
      setPagination(response.pagination);
      
      // Notificar cambio en el count si es diferente
      if (response.pagination.totalComments !== initialCommentsCount && onCommentsCountChange) {
        onCommentsCountChange(response.pagination.totalComments);
      }

    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleCreateComment = async (content, parentId = null) => {
    if (!content.trim()) return;

    const validation = commentsService.validateComment(content);
    if (!validation.isValid) {
      showError(validation.errors.join(', '));
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await commentsService.createComment(postId, {
        content: content.trim(),
        parent_id: parentId
      });

      // Añadir el nuevo comentario a la lista
      if (parentId) {
        // Es una respuesta - reorganizar los comentarios
        await loadComments(1, false);
      } else {
        // Es un comentario principal - añadir al inicio
        setComments(prev => [response.comment, ...prev]);
        setPagination(prev => ({
          ...prev,
          totalComments: prev.totalComments + 1
        }));
        
        if (onCommentsCountChange) {
          onCommentsCountChange(pagination.totalComments + 1);
        }
      }

      setNewComment('');
      setReplyingTo(null);
      
    } catch (error) {
      showError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await commentsService.editComment(commentId, newContent);
      
      // Actualizar el comentario en la lista local
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: newContent, updatedAt: new Date() }
          : comment
      ));
      
      setEditingComment(null);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      return;
    }

    try {
      await commentsService.deleteComment(commentId);
      
      // Remover comentario de la lista local
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setPagination(prev => ({
        ...prev,
        totalComments: prev.totalComments - 1
      }));
      
      if (onCommentsCountChange) {
        onCommentsCountChange(pagination.totalComments - 1);
      }
      
    } catch (error) {
      showError(error.message);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await commentsService.toggleLike(commentId);
      
      // Actualizar el like en la lista local
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              userLiked: response.liked, 
              likesCount: response.likesCount 
            }
          : comment
      ));
      
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const CommentInput = ({ onSubmit, placeholder = "Escribe un comentario...", initialValue = "", autoFocus = false }) => {
    const [value, setValue] = useState(initialValue);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(value);
        setValue('');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          {currentUser?.profileImage ? (
            <img 
              src={currentUser.profileImage} 
              alt={currentUser.displayName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-white text-xs">
              {currentUser?.displayName?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            maxLength={1000}
            autoFocus={autoFocus}
          />
          <button
            type="submit"
            disabled={!value.trim() || isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    );
  };

  const CommentItem = ({ comment, level = 0 }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [editValue, setEditValue] = useState(comment.content);
    const isOwner = currentUser && currentUser.id === comment.user.id;
    const canReply = level < 2; // Máximo 3 niveles

    return (
      <div className={`${level > 0 ? 'ml-8 border-l border-purple-500/20 pl-4' : ''}`}>
        <div className="flex gap-3 py-3">
          {/* Avatar */}
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            {comment.user.profileImage ? (
              <img 
                src={comment.user.profileImage} 
                alt={comment.user.displayName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-xs">
                {comment.user.displayName?.charAt(0) || comment.user.username.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white text-sm font-medium">
                {comment.user.displayName || comment.user.username}
              </span>
              {comment.user.isVerified && (
                <Verified className="text-blue-500" size={12} />
              )}
              {comment.user.isCreator && (
                <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded">
                  CREATOR
                </span>
              )}
              <span className="text-gray-400 text-xs">
                {commentsService.formatTimeAgo(comment.createdAt)}
                {comment.updatedAt && comment.updatedAt > comment.createdAt && (
                  <span className="ml-1">(editado)</span>
                )}
              </span>

              {/* Menu */}
              {isOwner && (
                <div className="ml-auto relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-6 bg-gray-800 border border-gray-600 rounded-lg py-1 z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Edit size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteComment(comment.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            {editingComment === comment.id ? (
              <div className="mb-2">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleEditComment(comment.id, editValue);
                }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 bg-black/30 border border-purple-500/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-purple-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingComment(null);
                        setEditValue(comment.content);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <p className="text-gray-300 text-sm mb-2 leading-relaxed">
                {comment.content}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`flex items-center gap-1 transition-colors ${
                  comment.userLiked 
                    ? 'text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart 
                  size={14} 
                  fill={comment.userLiked ? 'currentColor' : 'none'}
                />
                {comment.likesCount > 0 && (
                  <span className="text-xs">{formatNumber(comment.likesCount)}</span>
                )}
              </button>

              {canReply && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Reply size={14} />
                  <span className="text-xs">Responder</span>
                </button>
              )}
            </div>

            {/* Reply input */}
            {replyingTo === comment.id && (
              <div className="mt-3">
                <CommentInput
                  onSubmit={(content) => handleCreateComment(content, comment.id)}
                  placeholder={`Responder a ${comment.user.displayName || comment.user.username}...`}
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!showComments) {
    return null; // No mostrar nada cuando está colapsado
  }

  return (
    <div className="border-t border-purple-500/20 pt-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex items-center justify-between">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium flex items-center gap-2">
          <MessageCircle size={16} />
          Comentarios ({formatNumber(pagination.totalComments)})
        </h4>
        <button
          onClick={onToggleComments}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronUp size={16} />
        </button>
      </div>

      {/* New comment input */}
      <div className="mb-4">
        <CommentInput
          onSubmit={(content) => handleCreateComment(content)}
          placeholder="Escribe un comentario..."
        />
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2 opacity-50" />
          <p className="text-gray-400">No hay comentarios aún</p>
          <p className="text-gray-500 text-sm">¡Sé el primero en comentar!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              level={comment.level - 1}
            />
          ))}

          {/* Load more button */}
          {pagination.hasNextPage && (
            <div className="text-center pt-4">
              <button
                onClick={() => loadComments(pagination.currentPage + 1, true)}
                disabled={isLoadingMore}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors flex items-center gap-2 mx-auto"
              >
                {isLoadingMore ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Cargando...
                  </>
                ) : (
                  `Cargar más comentarios`
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
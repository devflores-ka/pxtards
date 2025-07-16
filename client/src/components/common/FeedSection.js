// client/src/components/FeedSection.js
import React, { useState, useEffect } from 'react';
import { Loader, RefreshCw, Plus } from 'lucide-react';
import Post from './Post';
import CreatePostModal from './CreatePostModal';
import contentService from '../../services/contentService';

const FeedSection = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
    isLoadingMore: false
  });

  // Cargar feed inicial
  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async (page = 1, append = false) => {
    try {
      if (page === 1 && !append) {
        setIsLoading(true);
      } else {
        setPagination(prev => ({ ...prev, isLoadingMore: true }));
      }

      const response = await contentService.getFeed(page, 10);
      
      if (append) {
        setPosts(prev => [...prev, ...response.posts]);
      } else {
        setPosts(response.posts);
      }
      
      setPagination({
        currentPage: response.pagination.currentPage,
        hasNextPage: response.pagination.hasNextPage,
        isLoadingMore: false
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading feed:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setPagination(prev => ({ ...prev, isLoadingMore: false }));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    contentService.clearCache();
    await loadFeed(1, false);
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !pagination.isLoadingMore) {
      loadFeed(pagination.currentPage + 1, true);
    }
  };

  const handlePostCreated = (newPost) => {
    // Añadir el nuevo post al inicio del feed
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLikeUpdate = (postId, liked, newLikesCount) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, userLiked: liked, likesCount: newLikesCount }
        : post
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Cargando feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => loadFeed()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de refrescar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Feed</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Crear Post</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw 
              size={20} 
              className={isRefreshing ? 'animate-spin' : ''} 
            />
          </button>
        </div>
      </div>

      {/* Quick post input */}
      <div 
        onClick={() => setShowCreateModal(true)}
        className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.displayName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-sm">
                {user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-gray-400">¿Qué está pasando?</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400">
            <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No hay posts aún</h3>
            <p className="mb-6">¡Sé el primero en compartir algo!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Crear mi primer post
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              currentUser={user}
              onLikeUpdate={handleLikeUpdate}
            />
          ))}
          
          {/* Load more button */}
          {pagination.hasNextPage && (
            <div className="text-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={pagination.isLoadingMore}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                {pagination.isLoadingMore ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Cargando...
                  </>
                ) : (
                  'Cargar más posts'
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear posts */}
      <CreatePostModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default FeedSection;
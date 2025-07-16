// client/src/components/Post.js
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Eye, Lock, Verified, MoreHorizontal } from 'lucide-react';
import contentService from '../../services/contentService';

const Post = ({ post, onLikeUpdate, currentUser }) => {
  const [isLiked, setIsLiked] = useState(post.userLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await contentService.toggleLike(post.id);
      
      setIsLiked(response.liked);
      setLikesCount(response.likesCount);
      
      // Notificar al componente padre si es necesario
      if (onLikeUpdate) {
        onLikeUpdate(post.id, response.liked, response.likesCount);
      }
      
    } catch (error) {
      console.error('Error al dar like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const isOwner = currentUser && currentUser.id === post.user.id;

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
      {/* Header del post */}
      <div className="p-4 border-b border-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {post.user.profileImage ? (
                <img 
                  src={post.user.profileImage} 
                  alt={post.user.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold">
                  {post.user.displayName?.charAt(0) || post.user.username.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">
                  {post.user.displayName || post.user.username}
                </h3>
                {post.user.isVerified && (
                  <Verified className="text-blue-500" size={16} />
                )}
                {post.user.isCreator && (
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                    CREATOR
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>@{post.user.username}</span>
                <span>•</span>
                <span>{contentService.formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Menú de opciones */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Contenido del post */}
      <div className="p-4">
        {/* Título (si existe) */}
        {post.title && (
          <h2 className="text-lg font-bold text-white mb-2">{post.title}</h2>
        )}

        {/* Descripción */}
        <p className="text-gray-300 mb-4 leading-relaxed">{post.description}</p>

        {/* Media content */}
        {post.contentType === 'image' && post.mediaUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden">
            {post.isPremium && !isOwner ? (
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center border border-purple-500/20">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 text-purple-400" size={32} />
                  <p className="text-white font-semibold">Contenido Premium</p>
                  <p className="text-gray-400 text-sm">${post.price}</p>
                </div>
              </div>
            ) : (
              <img 
                src={post.mediaUrl} 
                alt={post.title || 'Post image'}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
        )}

        {post.contentType === 'video' && post.mediaUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden">
            {post.isPremium && !isOwner ? (
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center border border-purple-500/20">
                <div className="text-center">
                  <Lock className="mx-auto mb-2 text-purple-400" size={32} />
                  <p className="text-white font-semibold">Video Premium</p>
                  <p className="text-gray-400 text-sm">${post.price}</p>
                </div>
              </div>
            ) : (
              <video 
                controls 
                className="w-full h-auto rounded-lg"
                poster={post.thumbnailUrl}
              >
                <source src={post.mediaUrl} type="video/mp4" />
                Tu navegador no soporta videos.
              </video>
            )}
          </div>
        )}

        {/* Premium badge */}
        {post.isPremium && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <Lock className="text-yellow-400" size={16} />
            <span className="text-yellow-400 text-sm font-medium">
              Contenido Premium - ${post.price}
            </span>
          </div>
        )}
      </div>

      {/* Stats y acciones */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Like */}
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 transition-colors ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart 
                size={20} 
                fill={isLiked ? 'currentColor' : 'none'}
                className={isLiking ? 'animate-pulse' : ''}
              />
              <span className="text-sm">{formatNumber(likesCount)}</span>
            </button>

            {/* Comments */}
            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
              <MessageCircle size={20} />
              <span className="text-sm">{formatNumber(post.commentsCount)}</span>
            </button>

            {/* Share */}
            <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors">
              <Share size={20} />
            </button>
          </div>

          {/* Views */}
          <div className="flex items-center gap-2 text-gray-400">
            <Eye size={16} />
            <span className="text-sm">{formatNumber(post.viewsCount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
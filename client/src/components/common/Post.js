// client/src/components/common/Post.js
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Eye, Lock, Verified, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import contentService from '../../services/contentService';
import Comments from './Comments';

const Post = ({ post, onLikeUpdate, currentUser }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.userLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

  const handleCommentsCountChange = (newCount) => {
    setCommentsCount(newCount);
  };

  const handleUserClick = () => {
    navigate(`/profile/${post.user.username}`);
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
          <button
            onClick={handleUserClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {/* Avatar */}
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {post.user.profileImage ? (
                <img 
                  src={post.user.profileImage} 
                  alt={post.user.displayName || post.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {(post.user.displayName || post.user.username).charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* User info */}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">
                  {post.user.displayName || post.user.username}
                </h3>
                {post.user.isVerified && (
                  <Verified className="text-blue-400" size={16} />
                )}
                {post.user.isCreator && (
                  <span className="bg-purple-600/30 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                    Creator
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">@{post.user.username}</p>
            </div>
          </button>
          
          {/* Options */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        {post.title && (
          <h2 className="text-white text-lg font-semibold mb-2">
            {post.title}
          </h2>
        )}

        {/* Description */}
        {post.description && (
          <p className="text-gray-300 mb-4 leading-relaxed">
            {post.description}
          </p>
        )}

        {/* Media */}
        {post.mediaUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {post.contentType === 'image' ? (
              <img 
                src={post.mediaUrl} 
                alt={post.title || 'Post image'}
                className="w-full h-auto max-h-96 object-cover"
              />
            ) : post.contentType === 'video' ? (
              <video 
                src={post.mediaUrl}
                controls
                className="w-full h-auto max-h-96"
                poster={post.thumbnailUrl}
              >
                Tu navegador no soporta videos.
              </video>
            ) : null}
          </div>
        )}

        {/* Premium badge */}
        {post.isPremium && (
          <div className="flex items-center gap-2 mb-4">
            <Lock size={16} className="text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">
              Contenido Premium - ${post.price}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-purple-500/10">
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
              } ${isLiking ? 'opacity-50' : ''}`}
            >
              <Heart 
                size={20} 
                fill={isLiked ? 'currentColor' : 'none'}
              />
              {likesCount > 0 && (
                <span className="text-sm">{formatNumber(likesCount)}</span>
              )}
            </button>

            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <MessageCircle size={20} />
              {commentsCount > 0 && (
                <span className="text-sm">{formatNumber(commentsCount)}</span>
              )}
            </button>

            {/* Share */}
            <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
              <Share size={20} />
            </button>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Eye size={16} />
            <span>{formatNumber(post.viewsCount)}</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <Comments
        postId={post.id}
        currentUser={currentUser}
        initialCommentsCount={commentsCount}
        onCommentsCountChange={handleCommentsCountChange}
        showComments={showComments}
        onToggleComments={() => setShowComments(!showComments)}
      />
    </div>
  );
};

export default Post;
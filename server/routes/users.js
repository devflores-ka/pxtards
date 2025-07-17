// server/routes/users.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Rate limiting para usuarios
const usersLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50,
  message: {
    message: 'Too many user requests, please try again later.'
  }
});

// Validación schemas
const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(2).max(100).optional(),
  bio: Joi.string().max(500).optional().allow(''),
  profileImage: Joi.string().uri().optional().allow(''),
  coverImage: Joi.string().uri().optional().allow(''),
  subscriptionPrice: Joi.number().min(0).max(99.99).optional(),
  isCreator: Joi.boolean().optional()
});

// @route   GET /api/users/username/:username
// @desc    Obtener perfil público de usuario por username
// @access  Public (con info adicional si está autenticado)
router.get('/username/:username', optionalAuth, usersLimiter, async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user?.id;

    console.log(`👤 Fetching profile for username: ${username}`);

    // Obtener datos del usuario por username
    const userResult = await pool.query(
      `SELECT 
        id, username, email, display_name, bio, profile_image, cover_image,
        is_creator, is_verified, subscription_price, total_earnings,
        followers_count, following_count, created_at
       FROM users 
       WHERE username = $1`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];
    const userId = user.id;

    // Verificar si el usuario actual sigue a este usuario
    let isFollowing = false;
    let isOwnProfile = false;

    if (currentUserId) {
      isOwnProfile = currentUserId === userId;
      
      if (!isOwnProfile) {
        const followResult = await pool.query(
          'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
          [currentUserId, userId]
        );
        isFollowing = followResult.rows.length > 0;
      }
    }

    // Obtener estadísticas del usuario
    const statsResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT c.id) as total_posts,
        COUNT(DISTINCT cl.id) as total_likes_received,
        COUNT(DISTINCT cm.id) as total_comments_received
       FROM users u
       LEFT JOIN content c ON u.id = c.user_id
       LEFT JOIN content_likes cl ON c.id = cl.content_id
       LEFT JOIN comments cm ON c.id = cm.content_id
       WHERE u.id = $1`,
      [userId]
    );

    const stats = statsResult.rows[0];

    // Obtener posts recientes del usuario
    const postsResult = await pool.query(
      `SELECT 
        c.id, c.title, c.description, c.content_type, c.media_url, 
        c.thumbnail_url, c.is_premium, c.price, c.likes_count, 
        c.comments_count, c.views_count, c.created_at,
        -- Verificar si el usuario actual dio like
        ${currentUserId ? 
          `EXISTS(SELECT 1 FROM content_likes cl WHERE cl.content_id = c.id AND cl.user_id = $2) as user_liked` :
          'false as user_liked'
        }
       FROM content c
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC
       LIMIT 12`,
      currentUserId ? [userId, currentUserId] : [userId]
    );

    const profileData = {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      bio: user.bio,
      profileImage: user.profile_image,
      coverImage: user.cover_image,
      isCreator: user.is_creator,
      isVerified: user.is_verified,
      subscriptionPrice: parseFloat(user.subscription_price),
      followersCount: user.followers_count,
      followingCount: user.following_count,
      createdAt: user.created_at,
      stats: {
        totalPosts: parseInt(stats.total_posts),
        totalLikesReceived: parseInt(stats.total_likes_received),
        totalCommentsReceived: parseInt(stats.total_comments_received)
      },
      posts: postsResult.rows.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        contentType: post.content_type,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        isPremium: post.is_premium,
        price: parseFloat(post.price),
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        viewsCount: post.views_count,
        userLiked: post.user_liked,
        createdAt: post.created_at
      })),
      // Info adicional si está autenticado
      ...(currentUserId && {
        isFollowing,
        isOwnProfile,
        // Solo mostrar email si es su propio perfil
        ...(isOwnProfile && { 
          email: user.email,
          totalEarnings: parseFloat(user.total_earnings)
        })
      })
    };

    res.json({
      user: profileData
    });

  } catch (error) {
    console.error('❌ Get user profile error:', error);
    res.status(500).json({
      message: 'Server error fetching user profile'
    });
  }
});

// @route   GET /api/users/:userId
// @desc    Obtener perfil público de usuario por ID
// @access  Public (con info adicional si está autenticado)
router.get('/:userId', optionalAuth, usersLimiter, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user?.id;

    console.log(`👤 Fetching profile for user: ${targetUserId}`);

    // Obtener datos del usuario
    const userResult = await pool.query(
      `SELECT 
        id, username, email, display_name, bio, profile_image, cover_image,
        is_creator, is_verified, subscription_price, total_earnings,
        followers_count, following_count, created_at
       FROM users 
       WHERE id = $1`,
      [targetUserId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const targetUser = userResult.rows[0];

    // Verificar si el usuario actual sigue a este usuario
    let isFollowing = false;
    let isOwnProfile = false;

    if (currentUserId) {
      isOwnProfile = currentUserId === targetUserId;
      
      if (!isOwnProfile) {
        const followResult = await pool.query(
          'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
          [currentUserId, targetUserId]
        );
        isFollowing = followResult.rows.length > 0;
      }
    }

    // Obtener estadísticas del usuario
    const statsResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT c.id) as total_posts,
        COUNT(DISTINCT cl.id) as total_likes_received,
        COUNT(DISTINCT cm.id) as total_comments_received
       FROM users u
       LEFT JOIN content c ON u.id = c.user_id
       LEFT JOIN content_likes cl ON c.id = cl.content_id
       LEFT JOIN comments cm ON c.id = cm.content_id
       WHERE u.id = $1`,
      [targetUserId]
    );

    const stats = statsResult.rows[0];

    // Obtener posts recientes del usuario
    const postsResult = await pool.query(
      `SELECT 
        c.id, c.title, c.description, c.content_type, c.media_url, 
        c.thumbnail_url, c.is_premium, c.price, c.likes_count, 
        c.comments_count, c.views_count, c.created_at,
        -- Verificar si el usuario actual dio like
        ${currentUserId ? 
          `EXISTS(SELECT 1 FROM content_likes cl WHERE cl.content_id = c.id AND cl.user_id = $2) as user_liked` :
          'false as user_liked'
        }
       FROM content c
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC
       LIMIT 12`,
      currentUserId ? [targetUserId, currentUserId] : [targetUserId]
    );

    const profileData = {
      id: targetUser.id,
      username: targetUser.username,
      displayName: targetUser.display_name,
      bio: targetUser.bio,
      profileImage: targetUser.profile_image,
      coverImage: targetUser.cover_image,
      isCreator: targetUser.is_creator,
      isVerified: targetUser.is_verified,
      subscriptionPrice: parseFloat(targetUser.subscription_price),
      followersCount: targetUser.followers_count,
      followingCount: targetUser.following_count,
      createdAt: targetUser.created_at,
      stats: {
        totalPosts: parseInt(stats.total_posts),
        totalLikesReceived: parseInt(stats.total_likes_received),
        totalCommentsReceived: parseInt(stats.total_comments_received)
      },
      posts: postsResult.rows.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        contentType: post.content_type,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        isPremium: post.is_premium,
        price: parseFloat(post.price),
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        viewsCount: post.views_count,
        userLiked: post.user_liked,
        createdAt: post.created_at
      })),
      // Info adicional si está autenticado
      ...(currentUserId && {
        isFollowing,
        isOwnProfile,
        // Solo mostrar email si es su propio perfil
        ...(isOwnProfile && { 
          email: targetUser.email,
          totalEarnings: parseFloat(targetUser.total_earnings)
        })
      })
    };

    res.json({
      user: profileData
    });

  } catch (error) {
    console.error('❌ Get user profile error:', error);
    res.status(500).json({
      message: 'Server error fetching user profile'
    });
  }
});

// @route   GET /api/users/search
// @desc    Buscar usuarios
// @access  Public
router.get('/search', optionalAuth, usersLimiter, async (req, res) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const currentUserId = req.user?.id;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        message: 'Search query must be at least 2 characters'
      });
    }

    console.log(`🔍 Searching users with query: ${query}`);

    const searchTerm = `%${query.trim()}%`;
    
    const result = await pool.query(
      `SELECT 
        u.id, u.username, u.display_name, u.bio, u.profile_image, 
        u.is_creator, u.is_verified, u.followers_count,
        ${currentUserId ? 
          `EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = $3 AND f.following_id = u.id) as is_following` :
          'false as is_following'
        }
       FROM users u
       WHERE (u.username ILIKE $1 OR u.display_name ILIKE $1)
       ORDER BY u.followers_count DESC, u.username ASC
       LIMIT $2 OFFSET ${offset}`,
      currentUserId ? [searchTerm, limit, currentUserId] : [searchTerm, limit]
    );

    const users = result.rows.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      bio: user.bio,
      profileImage: user.profile_image,
      isCreator: user.is_creator,
      isVerified: user.is_verified,
      followersCount: user.followers_count,
      isFollowing: user.is_following
    }));

    res.json({
      users,
      query: query.trim(),
      pagination: {
        currentPage: parseInt(page),
        resultsCount: users.length
      }
    });

  } catch (error) {
    console.error('❌ Search users error:', error);
    res.status(500).json({
      message: 'Server error searching users'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Actualizar perfil del usuario actual
// @access  Private
router.put('/profile', authMiddleware, usersLimiter, async (req, res) => {
  try {
    console.log('✏️ Updating profile:', req.body);

    // Validar datos
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const userId = req.user.id;
    const updateFields = [];
    const updateValues = [];
    let valueIndex = 1;

    // Construir query dinámicamente
    for (const [key, val] of Object.entries(value)) {
      if (val !== undefined) {
        const dbField = key === 'displayName' ? 'display_name' :
                       key === 'profileImage' ? 'profile_image' :
                       key === 'coverImage' ? 'cover_image' :
                       key === 'subscriptionPrice' ? 'subscription_price' :
                       key === 'isCreator' ? 'is_creator' : key;
        
        updateFields.push(`${dbField} = $${valueIndex}`);
        updateValues.push(val);
        valueIndex++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        message: 'No fields to update'
      });
    }

    // Agregar user ID al final
    updateValues.push(userId);

    const result = await pool.query(
      `UPDATE users 
       SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${valueIndex}
       RETURNING id, username, email, display_name, bio, profile_image, 
                 cover_image, is_creator, is_verified, subscription_price,
                 total_earnings, followers_count, following_count, updated_at`,
      updateValues
    );

    const updatedUser = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        displayName: updatedUser.display_name,
        bio: updatedUser.bio,
        profileImage: updatedUser.profile_image,
        coverImage: updatedUser.cover_image,
        isCreator: updatedUser.is_creator,
        isVerified: updatedUser.is_verified,
        subscriptionPrice: parseFloat(updatedUser.subscription_price),
        totalEarnings: parseFloat(updatedUser.total_earnings),
        followersCount: updatedUser.followers_count,
        followingCount: updatedUser.following_count,
        updatedAt: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      message: 'Server error updating profile'
    });
  }
});

// @route   POST /api/users/:userId/follow
// @desc    Seguir a un usuario
// @access  Private
router.post('/:userId/follow', authMiddleware, usersLimiter, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const followerId = req.user.id;

    console.log(`👥 User ${followerId} trying to follow ${targetUserId}`);

    if (followerId === targetUserId) {
      return res.status(400).json({
        message: 'Cannot follow yourself'
      });
    }

    // Verificar que el usuario a seguir existe
    const userExists = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [targetUserId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Verificar si ya lo sigue
    const existingFollow = await pool.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, targetUserId]
    );

    if (existingFollow.rows.length > 0) {
      return res.status(400).json({
        message: 'Already following this user'
      });
    }

    // Crear relación de seguimiento
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [followerId, targetUserId]
    );

    // Actualizar contadores
    await pool.query(
      'UPDATE users SET followers_count = followers_count + 1 WHERE id = $1',
      [targetUserId]
    );

    await pool.query(
      'UPDATE users SET following_count = following_count + 1 WHERE id = $1',
      [followerId]
    );

    res.json({
      message: 'User followed successfully',
      isFollowing: true
    });

  } catch (error) {
    console.error('❌ Follow user error:', error);
    res.status(500).json({
      message: 'Server error following user'
    });
  }
});

// @route   DELETE /api/users/:userId/follow
// @desc    Dejar de seguir a un usuario
// @access  Private
router.delete('/:userId/follow', authMiddleware, usersLimiter, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const followerId = req.user.id;

    console.log(`👥 User ${followerId} trying to unfollow ${targetUserId}`);

    // Verificar que existe la relación
    const followResult = await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING id',
      [followerId, targetUserId]
    );

    if (followResult.rows.length === 0) {
      return res.status(400).json({
        message: 'Not following this user'
      });
    }

    // Actualizar contadores
    await pool.query(
      'UPDATE users SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = $1',
      [targetUserId]
    );

    await pool.query(
      'UPDATE users SET following_count = GREATEST(following_count - 1, 0) WHERE id = $1',
      [followerId]
    );

    res.json({
      message: 'User unfollowed successfully',
      isFollowing: false
    });

  } catch (error) {
    console.error('❌ Unfollow user error:', error);
    res.status(500).json({
      message: 'Server error unfollowing user'
    });
  }
});

// @route   GET /api/users/:userId/followers
// @desc    Obtener lista de seguidores
// @access  Public
router.get('/:userId/followers', optionalAuth, usersLimiter, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const currentUserId = req.user?.id;

    console.log(`👥 Fetching followers for user: ${targetUserId}`);

    const result = await pool.query(
      `SELECT 
        u.id, u.username, u.display_name, u.profile_image, 
        u.is_creator, u.is_verified, u.followers_count,
        ${currentUserId ? 
          `EXISTS(SELECT 1 FROM follows f2 WHERE f2.follower_id = $3 AND f2.following_id = u.id) as is_following` :
          'false as is_following'
        }
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC
       LIMIT $2 OFFSET ${offset}`,
      currentUserId ? [targetUserId, limit, currentUserId] : [targetUserId, limit]
    );

    // Obtener total para paginación
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM follows WHERE following_id = $1',
      [targetUserId]
    );

    const totalFollowers = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalFollowers / limit);

    const followers = result.rows.map(follower => ({
      id: follower.id,
      username: follower.username,
      displayName: follower.display_name,
      profileImage: follower.profile_image,
      isCreator: follower.is_creator,
      isVerified: follower.is_verified,
      followersCount: follower.followers_count,
      isFollowing: follower.is_following
    }));

    res.json({
      followers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalFollowers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Get followers error:', error);
    res.status(500).json({
      message: 'Server error fetching followers'
    });
  }
});

// @route   GET /api/users/:userId/following
// @desc    Obtener lista de usuarios que sigue
// @access  Public
router.get('/:userId/following', optionalAuth, usersLimiter, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const currentUserId = req.user?.id;

    console.log(`👥 Fetching following for user: ${targetUserId}`);

    const result = await pool.query(
      `SELECT 
        u.id, u.username, u.display_name, u.profile_image, 
        u.is_creator, u.is_verified, u.followers_count,
        ${currentUserId ? 
          `EXISTS(SELECT 1 FROM follows f2 WHERE f2.follower_id = $3 AND f2.following_id = u.id) as is_following` :
          'false as is_following'
        }
       FROM follows f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC
       LIMIT $2 OFFSET ${offset}`,
      currentUserId ? [targetUserId, limit, currentUserId] : [targetUserId, limit]
    );

    // Obtener total para paginación
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM follows WHERE follower_id = $1',
      [targetUserId]
    );

    const totalFollowing = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalFollowing / limit);

    const following = result.rows.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      profileImage: user.profile_image,
      isCreator: user.is_creator,
      isVerified: user.is_verified,
      followersCount: user.followers_count,
      isFollowing: user.is_following
    }));

    res.json({
      following,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalFollowing,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Get following error:', error);
    res.status(500).json({
      message: 'Server error fetching following'
    });
  }
});

module.exports = router;
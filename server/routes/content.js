// server/routes/content.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Rate limiting para contenido
const contentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // máximo 50 requests por IP
  message: {
    message: 'Too many content requests, please try again later.'
  }
});

// Esquemas de validación
const createPostSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().max(2000).required(),
  content_type: Joi.string().valid('text', 'image', 'video').default('text'),
  media_url: Joi.string().uri().optional(),
  thumbnail_url: Joi.string().uri().optional(),
  is_premium: Joi.boolean().default(false),
  price: Joi.number().min(0).max(999.99).default(0)
});

// @route   GET /api/content/feed
// @desc    Obtener feed de posts
// @access  Private
router.get('/feed', authMiddleware, contentLimiter, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log(`📱 Getting feed for user: ${req.user.id}, page: ${page}`);

    const result = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.content_type,
        c.media_url,
        c.thumbnail_url,
        c.price,
        c.is_premium,
        c.likes_count,
        c.comments_count,
        c.views_count,
        c.created_at,
        u.id as user_id,
        u.username,
        u.display_name,
        u.profile_image,
        u.is_creator,
        u.is_verified,
        -- Verificar si el usuario actual dio like
        EXISTS(
          SELECT 1 FROM content_likes cl 
          WHERE cl.content_id = c.id AND cl.user_id = $1
        ) as user_liked
      FROM content c
      JOIN users u ON c.user_id = u.id
      WHERE c.created_at >= NOW() - INTERVAL '30 days'
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user.id, limit, offset]);

    // Obtener total de posts para paginación
    const countResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM content c
      WHERE c.created_at >= NOW() - INTERVAL '30 days'
    `);

    const posts = result.rows.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      contentType: post.content_type,
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url,
      price: parseFloat(post.price),
      isPremium: post.is_premium,
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      viewsCount: post.views_count,
      createdAt: post.created_at,
      userLiked: post.user_liked,
      user: {
        id: post.user_id,
        username: post.username,
        displayName: post.display_name,
        profileImage: post.profile_image,
        isCreator: post.is_creator,
        isVerified: post.is_verified
      }
    }));

    const totalPosts = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Feed error:', error);
    res.status(500).json({
      message: 'Server error fetching feed'
    });
  }
});

// @route   POST /api/content/posts
// @desc    Crear nuevo post
// @access  Private
router.post('/posts', authMiddleware, contentLimiter, async (req, res) => {
  try {
    console.log('📝 Creating post:', req.body);

    // Validar datos
    const { error, value } = createPostSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const {
      title,
      description,
      content_type,
      media_url,
      thumbnail_url,
      is_premium,
      price
    } = value;

    // Crear post en la base de datos
    const result = await pool.query(`
      INSERT INTO content (
        user_id, title, description, content_type, 
        media_url, thumbnail_url, is_premium, price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      req.user.id, title, description, content_type,
      media_url, thumbnail_url, is_premium, price
    ]);

    const post = result.rows[0];

    // Obtener datos del usuario para la respuesta
    const userResult = await pool.query(`
      SELECT username, display_name, profile_image, is_creator, is_verified
      FROM users WHERE id = $1
    `, [req.user.id]);

    const user = userResult.rows[0];

    const responsePost = {
      id: post.id,
      title: post.title,
      description: post.description,
      contentType: post.content_type,
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url,
      price: parseFloat(post.price),
      isPremium: post.is_premium,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      createdAt: post.created_at,
      userLiked: false,
      user: {
        id: req.user.id,
        username: user.username,
        displayName: user.display_name,
        profileImage: user.profile_image,
        isCreator: user.is_creator,
        isVerified: user.is_verified
      }
    };

    console.log('✅ Post created successfully:', responsePost.id);

    res.status(201).json({
      message: 'Post created successfully',
      post: responsePost
    });

  } catch (error) {
    console.error('❌ Create post error:', error);
    res.status(500).json({
      message: 'Server error creating post'
    });
  }
});

// @route   POST /api/content/posts/:id/like
// @desc    Like/Unlike un post
// @access  Private
router.post('/posts/:id/like', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    console.log(`❤️ Toggle like for post ${postId} by user ${userId}`);

    // Verificar si el post existe
    const postCheck = await pool.query(
      'SELECT id FROM content WHERE id = $1',
      [postId]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verificar si ya existe el like
    const existingLike = await pool.query(
      'SELECT id FROM content_likes WHERE content_id = $1 AND user_id = $2',
      [postId, userId]
    );

    let liked;
    let likesCount;

    if (existingLike.rows.length > 0) {
      // Quitar like
      await pool.query(
        'DELETE FROM content_likes WHERE content_id = $1 AND user_id = $2',
        [postId, userId]
      );

      // Decrementar contador
      await pool.query(
        'UPDATE content SET likes_count = likes_count - 1 WHERE id = $1',
        [postId]
      );

      liked = false;
    } else {
      // Añadir like
      await pool.query(
        'INSERT INTO content_likes (content_id, user_id) VALUES ($1, $2)',
        [postId, userId]
      );

      // Incrementar contador
      await pool.query(
        'UPDATE content SET likes_count = likes_count + 1 WHERE id = $1',
        [postId]
      );

      liked = true;
    }

    // Obtener nuevo count de likes
    const countResult = await pool.query(
      'SELECT likes_count FROM content WHERE id = $1',
      [postId]
    );

    likesCount = countResult.rows[0].likes_count;

    res.json({
      message: liked ? 'Post liked' : 'Post unliked',
      liked,
      likesCount
    });

  } catch (error) {
    console.error('❌ Like post error:', error);
    res.status(500).json({
      message: 'Server error liking post'
    });
  }
});

// @route   GET /api/content/posts/:id
// @desc    Obtener post específico
// @access  Private
router.get('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await pool.query(`
      SELECT 
        c.*,
        u.username,
        u.display_name,
        u.profile_image,
        u.is_creator,
        u.is_verified,
        EXISTS(
          SELECT 1 FROM content_likes cl 
          WHERE cl.content_id = c.id AND cl.user_id = $2
        ) as user_liked
      FROM content c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [postId, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = result.rows[0];

    // Incrementar view count
    await pool.query(
      'UPDATE content SET views_count = views_count + 1 WHERE id = $1',
      [postId]
    );

    const responsePost = {
      id: post.id,
      title: post.title,
      description: post.description,
      contentType: post.content_type,
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url,
      price: parseFloat(post.price),
      isPremium: post.is_premium,
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      viewsCount: post.views_count + 1, // Incluir la nueva view
      createdAt: post.created_at,
      userLiked: post.user_liked,
      user: {
        id: post.user_id,
        username: post.username,
        displayName: post.display_name,
        profileImage: post.profile_image,
        isCreator: post.is_creator,
        isVerified: post.is_verified
      }
    };

    res.json({ post: responsePost });

  } catch (error) {
    console.error('❌ Get post error:', error);
    res.status(500).json({
      message: 'Server error fetching post'
    });
  }
});

// @route   DELETE /api/content/posts/:id
// @desc    Eliminar post
// @access  Private
router.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Verificar que el post pertenece al usuario
    const postCheck = await pool.query(
      'SELECT user_id FROM content WHERE id = $1',
      [postId]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Eliminar post (esto también eliminará likes por CASCADE)
    await pool.query('DELETE FROM content WHERE id = $1', [postId]);

    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('❌ Delete post error:', error);
    res.status(500).json({
      message: 'Server error deleting post'
    });
  }
});

module.exports = router;
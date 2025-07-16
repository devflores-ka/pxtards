// server/routes/comments.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Rate limiting para comentarios
const commentsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // máximo 30 comentarios por IP cada 15 min
  message: {
    message: 'Too many comments, please try again later.'
  }
});

// Esquemas de validación
const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Comment cannot be empty',
    'string.max': 'Comment cannot exceed 1000 characters',
    'any.required': 'Comment content is required'
  }),
  parent_id: Joi.string().uuid().optional().allow(null)
});

// @route   GET /api/comments/post/:postId
// @desc    Obtener comentarios de un post
// @access  Private
router.get('/post/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    console.log(`💬 Getting comments for post: ${postId}, page: ${page}`);

    // Verificar que el post existe
    const postCheck = await pool.query(
      'SELECT id FROM content WHERE id = $1',
      [postId]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Obtener comentarios con información del usuario
    const result = await pool.query(`
      WITH RECURSIVE comment_tree AS (
        -- Comentarios principales (sin parent)
        SELECT 
          c.id,
          c.comment_text as content,
          c.content_id,
          c.user_id,
          c.parent_id,
          c.likes_count,
          c.created_at,
          c.updated_at,
          u.username,
          u.display_name,
          u.profile_image,
          u.is_creator,
          u.is_verified,
          1 as level,
          c.created_at::text as sort_path
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.content_id = $1 AND c.parent_id IS NULL
        
        UNION ALL
        
        -- Respuestas (con parent)
        SELECT 
          c.id,
          c.comment_text as content,
          c.content_id,
          c.user_id,
          c.parent_id,
          c.likes_count,
          c.created_at,
          c.updated_at,
          u.username,
          u.display_name,
          u.profile_image,
          u.is_creator,
          u.is_verified,
          ct.level + 1,
          ct.sort_path || '|' || c.created_at::text
        FROM comments c
        JOIN users u ON c.user_id = u.id
        JOIN comment_tree ct ON c.parent_id = ct.id
        WHERE ct.level < 3  -- Limitar a 3 niveles de profundidad
      )
      SELECT 
        ct.*,
        EXISTS(
          SELECT 1 FROM comment_likes cl 
          WHERE cl.comment_id = ct.id AND cl.user_id = $2
        ) as user_liked
      FROM comment_tree ct
      ORDER BY ct.sort_path, ct.created_at DESC
      LIMIT $3 OFFSET $4
    `, [postId, req.user.id, limit, offset]);

    // Obtener total de comentarios para paginación
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM comments WHERE content_id = $1',
      [postId]
    );

    const comments = result.rows.map(comment => ({
      id: comment.id,
      content: comment.content,
      postId: comment.content_id,
      parentId: comment.parent_id,
      level: comment.level,
      likesCount: comment.likes_count,
      userLiked: comment.user_liked,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      user: {
        id: comment.user_id,
        username: comment.username,
        displayName: comment.display_name,
        profileImage: comment.profile_image,
        isCreator: comment.is_creator,
        isVerified: comment.is_verified
      }
    }));

    const totalComments = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalComments / limit);

    res.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Get comments error:', error);
    res.status(500).json({
      message: 'Server error fetching comments'
    });
  }
});

// @route   POST /api/comments/post/:postId
// @desc    Crear comentario en un post
// @access  Private
router.post('/post/:postId', authMiddleware, commentsLimiter, async (req, res) => {
  try {
    const postId = req.params.postId;
    
    console.log('💬 Creating comment:', { postId, body: req.body });

    // Validar datos
    const { error, value } = createCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { content, parent_id } = value;

    // Verificar que el post existe
    const postCheck = await pool.query(
      'SELECT id FROM content WHERE id = $1',
      [postId]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Si es una respuesta, verificar que el comentario padre existe
    if (parent_id) {
      const parentCheck = await pool.query(
        'SELECT id FROM comments WHERE id = $1 AND content_id = $2',
        [parent_id, postId]
      );

      if (parentCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    // Crear comentario
    const result = await pool.query(`
      INSERT INTO comments (content_id, user_id, comment_text, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [postId, req.user.id, content, parent_id]);

    const comment = result.rows[0];

    // Incrementar contador de comentarios en el post
    await pool.query(
      'UPDATE content SET comments_count = comments_count + 1 WHERE id = $1',
      [postId]
    );

    // Obtener datos del usuario para la respuesta
    const userResult = await pool.query(`
      SELECT username, display_name, profile_image, is_creator, is_verified
      FROM users WHERE id = $1
    `, [req.user.id]);

    const user = userResult.rows[0];

    const responseComment = {
      id: comment.id,
      content: comment.comment_text,
      postId: comment.content_id,
      parentId: comment.parent_id,
      level: parent_id ? 2 : 1, // Simplificado
      likesCount: 0,
      userLiked: false,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
      user: {
        id: req.user.id,
        username: user.username,
        displayName: user.display_name,
        profileImage: user.profile_image,
        isCreator: user.is_creator,
        isVerified: user.is_verified
      }
    };

    console.log('✅ Comment created successfully:', responseComment.id);

    res.status(201).json({
      message: 'Comment created successfully',
      comment: responseComment
    });

  } catch (error) {
    console.error('❌ Create comment error:', error);
    res.status(500).json({
      message: 'Server error creating comment'
    });
  }
});

// @route   PUT /api/comments/:id
// @desc    Editar comentario
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;
    
    // Validar datos
    const { error, value } = createCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { content } = value;

    // Verificar que el comentario existe y pertenece al usuario
    const commentCheck = await pool.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (commentCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    // Actualizar comentario
    const result = await pool.query(`
      UPDATE comments 
      SET comment_text = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [content, commentId]);

    const updatedComment = result.rows[0];

    res.json({
      message: 'Comment updated successfully',
      comment: {
        id: updatedComment.id,
        content: updatedComment.comment_text,
        updatedAt: updatedComment.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Update comment error:', error);
    res.status(500).json({
      message: 'Server error updating comment'
    });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Eliminar comentario
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;

    // Verificar que el comentario existe y pertenece al usuario
    const commentCheck = await pool.query(
      'SELECT user_id, content_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (commentCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    const postId = commentCheck.rows[0].content_id;

    // Eliminar comentario (esto también eliminará replies por CASCADE)
    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);

    // Decrementar contador de comentarios en el post
    await pool.query(
      'UPDATE content SET comments_count = comments_count - 1 WHERE id = $1',
      [postId]
    );

    res.json({ message: 'Comment deleted successfully' });

  } catch (error) {
    console.error('❌ Delete comment error:', error);
    res.status(500).json({
      message: 'Server error deleting comment'
    });
  }
});

// @route   POST /api/comments/:id/like
// @desc    Like/Unlike un comentario
// @access  Private
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    console.log(`❤️ Toggle like for comment ${commentId} by user ${userId}`);

    // Verificar si el comentario existe
    const commentCheck = await pool.query(
      'SELECT id FROM comments WHERE id = $1',
      [commentId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Verificar si ya existe el like
    const existingLike = await pool.query(
      'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      [commentId, userId]
    );

    let liked;
    let likesCount;

    if (existingLike.rows.length > 0) {
      // Quitar like
      await pool.query(
        'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
        [commentId, userId]
      );

      // Decrementar contador
      await pool.query(
        'UPDATE comments SET likes_count = likes_count - 1 WHERE id = $1',
        [commentId]
      );

      liked = false;
    } else {
      // Añadir like
      await pool.query(
        'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)',
        [commentId, userId]
      );

      // Incrementar contador
      await pool.query(
        'UPDATE comments SET likes_count = likes_count + 1 WHERE id = $1',
        [commentId]
      );

      liked = true;
    }

    // Obtener nuevo count de likes
    const countResult = await pool.query(
      'SELECT likes_count FROM comments WHERE id = $1',
      [commentId]
    );

    likesCount = countResult.rows[0].likes_count;

    res.json({
      message: liked ? 'Comment liked' : 'Comment unliked',
      liked,
      likesCount
    });

  } catch (error) {
    console.error('❌ Like comment error:', error);
    res.status(500).json({
      message: 'Server error liking comment'
    });
  }
});

module.exports = router;
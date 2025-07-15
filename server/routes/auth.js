// server/routes/auth.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  hashPassword,
  comparePassword,
  generateToken
} = require('../utils/auth');

const router = express.Router();

// Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Aumentado a 10 para desarrollo
  message: {
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', authLimiter, async (req, res) => {
  try {
    console.log('📝 Datos recibidos en el registro:', req.body);
    
    // Validar datos de entrada
    const { error, value } = registerSchema.validate(req.body);
    
    if (error) {
      console.error('❌ Error de validación:', error.details);
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    const { username, email, password, displayName, isCreator } = value;
    
    console.log('✅ Datos validados:', { username, email, displayName, isCreator });

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      console.log('❌ Usuario ya existe');
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, display_name, is_creator) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, username, email, display_name, is_creator, is_verified, created_at`,
      [username, email, hashedPassword, displayName || username, isCreator || false]
    );

    const user = result.rows[0];
    console.log('✅ Usuario creado:', user);

    // Generar token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        isCreator: user.is_creator,
        isVerified: user.is_verified,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', authLimiter, async (req, res) => {
  try {
    console.log('📝 Datos recibidos en el login:', req.body);
    
    // Validar datos de entrada
    const { error, value } = loginSchema.validate(req.body);
    
    if (error) {
      console.error('❌ Error de validación:', error.details);
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    const { email, password } = value;

    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Verificar password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      console.log('❌ Password incorrecto');
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Actualizar último login
    await pool.query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generar token
    const token = generateToken(user.id);

    console.log('✅ Login exitoso para:', user.username);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        isCreator: user.is_creator,
        isVerified: user.is_verified,
        profileImage: user.profile_image,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener datos del usuario actual
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, display_name, bio, profile_image, cover_image,
              is_creator, is_verified, subscription_price, total_earnings,
              followers_count, following_count, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        bio: user.bio,
        profileImage: user.profile_image,
        coverImage: user.cover_image,
        isCreator: user.is_creator,
        isVerified: user.is_verified,
        subscriptionPrice: user.subscription_price,
        totalEarnings: user.total_earnings,
        followersCount: user.followers_count,
        followingCount: user.following_count,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      message: 'Server error fetching profile'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refrescar token
// @access  Private
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    // Generar nuevo token
    const token = generateToken(req.user.id);

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('❌ Refresh token error:', error);
    res.status(500).json({
      message: 'Server error refreshing token'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Cerrar sesión
// @access  Private
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Aquí podrías invalidar el token si usas una blacklist
    // Por ahora solo confirmamos el logout
    
    res.json({
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      message: 'Server error during logout'
    });
  }
});

module.exports = router;
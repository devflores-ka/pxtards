// server/utils/auth.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Esquemas de validación mejorados
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be less than 30 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must be less than 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  displayName: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Display name must be at least 2 characters long',
      'string.max': 'Display name must be less than 100 characters'
    }),
  isCreator: Joi.boolean()
    .optional()
    .default(false)
    .messages({
      'boolean.base': 'isCreator must be a boolean value'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Generar hash de password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Comparar password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generar JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Verificar token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Función para validar password manualmente (debugging)
const validatePassword = (password) => {
  const checks = {
    minLength: password.length >= 6,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password)
  };
  
  const isValid = Object.values(checks).every(check => check);
  
  return {
    isValid,
    checks,
    password: password
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  validatePassword
};
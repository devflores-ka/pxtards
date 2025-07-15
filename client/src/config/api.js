// client/src/config/api.js
const API_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000,
  },
  production: {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://tu-dominio.com/api',
    TIMEOUT: 15000,
  },
  staging: {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://staging.tu-dominio.com/api',
    TIMEOUT: 15000,
  }
};

// Determinar el entorno actual
const getEnvironment = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_ENV || 'production';
  }
  return 'development';
};

const currentEnv = getEnvironment();
const config = API_CONFIG[currentEnv];

export const API_BASE_URL = config.BASE_URL;
export const API_TIMEOUT = config.TIMEOUT;

// URLs específicas para diferentes endpoints
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  
  // Usuarios (para implementar después)
  USERS: {
    PROFILE: (userId) => `/users/${userId}`,
    UPDATE_PROFILE: '/users/profile',
    FOLLOW: (userId) => `/users/${userId}/follow`,
    UNFOLLOW: (userId) => `/users/${userId}/unfollow`,
    FOLLOWERS: (userId) => `/users/${userId}/followers`,
    FOLLOWING: (userId) => `/users/${userId}/following`
  },
  
  // Contenido (para implementar después)
  CONTENT: {
    POSTS: '/content/posts',
    POST: (postId) => `/content/posts/${postId}`,
    LIKE: (postId) => `/content/posts/${postId}/like`,
    COMMENT: (postId) => `/content/posts/${postId}/comments`,
    UPLOAD: '/content/upload'
  },
  
  // Pagos (para implementar después)
  PAYMENTS: {
    SUBSCRIBE: '/payments/subscribe',
    UNSUBSCRIBE: '/payments/unsubscribe',
    HISTORY: '/payments/history',
    EARNINGS: '/payments/earnings'
  }
};

console.log(`🔧 API configurada para entorno: ${currentEnv}`);
console.log(`🌐 Base URL: ${API_BASE_URL}`);
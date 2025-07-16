// client/src/App.js
import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home/index';
import './index.css';

// Crear contexto para el auth
const AuthContext = createContext();

// Provider que envuelve useAuth
const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto (opcional, mantienes el useAuth original)
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

function App() {
  return (
    <AuthProvider>
      <Router 
        future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }}
      >
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Otras rutas se añadirán después */}
          </Routes>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                backdropFilter: 'blur(10px)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
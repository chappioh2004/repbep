import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const auth = localStorage.getItem('repbep_auth');
      if (auth) {
        const { token } = JSON.parse(auth);
        if (token) {
          const userData = await authAPI.getMe();
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('repbep_auth');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    localStorage.setItem('repbep_auth', JSON.stringify({ token: data.token }));
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    localStorage.setItem('repbep_auth', JSON.stringify({ token: data.token }));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('repbep_auth');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

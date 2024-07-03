import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    id: localStorage.getItem('id') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (auth.token) {
        try {
          const response = await axios.get('http://127.0.0.1:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          setAuth((prevAuth) => ({
            ...prevAuth,
            role: response.data.role,
            id: response.data.id,
            isAuthenticated: true,
          }));
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('id', response.data.id);
        } catch (error) {
          console.error('Error checking auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('id');
          setAuth({
            token: null,
            role: null,
            id: null,
            isAuthenticated: false,
          });
        }
      }
    };
    checkAuth();
  }, [auth.token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('id', response.data.id);
      localStorage.setItem('nama', response.data.nama);
      setAuth({
        token: response.data.access_token,
        role: response.data.role,
        id: response.data.id,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('nama');
    setAuth({
      token: null,
      role: null,
      id: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

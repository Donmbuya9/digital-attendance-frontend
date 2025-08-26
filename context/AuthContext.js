"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/services/apiClient';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect runs once on app load to check if a user is already logged in.
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.get('/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user: userData } = response.data; // Assuming API returns user info on login
    localStorage.setItem('authToken', token);
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  const authContextValue = {
    user,
    loading,
    login, // We can refactor LoginPage to use this later
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

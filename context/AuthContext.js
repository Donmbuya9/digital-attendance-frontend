"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Default to true to show loading state initially
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // If a token exists, we must verify it.
      apiClient.get('/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // If the token is invalid (e.g., expired), clear it.
          localStorage.removeItem('authToken');
          setUser(null);
        })
        .finally(() => {
          // We are done with the initial check.
          setLoading(false);
        });
    } else {
      // No token found, so we are not logged in. Stop loading.
      setLoading(false);
    }
  }, []); // The empty dependency array ensures this runs only once on mount.

  const login = async (email, password) => {
    // This function will be called from the login page.
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;

    localStorage.setItem('authToken', token);
    setUser(userData); // Set the user state immediately.

    // --- THIS IS THE CRITICAL FIX FOR REDIRECTION ---
    // Redirect based on the user's role.
    if (userData.role === 'ADMINISTRATOR') {
      router.push('/admin-dashboard'); // Admin dashboard
    } else {
      router.push('/my-events'); // Attendee dashboard
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
import React, { useState, createContext, useEffect } from 'react';
import authService from '../../service/auth.service.js';
import userService from '../../service/user.service.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  // On initial load, check localStorage for existing session
  useEffect(() => {
    const checkLoggedIn = () => {
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const userData = JSON.parse(authData);
          if (userData.token) {
            setUserProfile(userData);
            setIsAuthenticated(true);
            
            // Load favorites from localStorage
            const storedFavorites = JSON.parse(localStorage.getItem('bookMyHostelFavorites')) || [];
            setFavorites(storedFavorites);
          }
        } catch (error) {
          console.error('Invalid auth data:', error);
          localStorage.removeItem('auth');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUserProfile(userData);
    setIsAuthenticated(true);
    // Load favorites from localStorage on login
    const storedFavorites = JSON.parse(localStorage.getItem('bookMyHostelFavorites')) || [];
    setFavorites(storedFavorites);
    return userData;
  };

  const loginWithUserData = (userData) => {
    setUserProfile(userData);
    setIsAuthenticated(true);
    // Load favorites from localStorage on login
    const storedFavorites = JSON.parse(localStorage.getItem('bookMyHostelFavorites')) || [];
    setFavorites(storedFavorites);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    setUserProfile(null);
    setIsAuthenticated(false);
    setFavorites([]);
  };

  // Note: Favorite functionality still uses localStorage.
  // This can be migrated to the backend once favorite-related API endpoints are created.
  const toggleFavorite = (hostel) => {
    let updatedFavorites = [];
    const isAlreadyFavorited = favorites.some(item => item.id === hostel.id);

    if (isAlreadyFavorited) {
      updatedFavorites = favorites.filter(item => item.id !== hostel.id);
    } else {
      updatedFavorites = [...favorites, hostel];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('bookMyHostelFavorites', JSON.stringify(updatedFavorites));
  };

  const isFavorited = (hostelId) => {
    return favorites.some(item => item.id === hostelId);
  };

  const value = {
    userProfile,
    isAuthenticated,
    loading,
    login,
    loginWithUserData,
    logout,
    favorites,
    toggleFavorite,
    isFavorited,
    setUserProfile, // Exposing for profile updates
    setIsAuthenticated, // Exposing for direct auth state updates
    bookingHistory: [], // Initialize empty booking history
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
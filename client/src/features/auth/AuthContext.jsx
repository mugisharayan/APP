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
    const checkLoggedIn = async () => {
      const user = authService.getCurrentUser();
      if (user && user.token) {
        try {
          // Verify token by fetching profile
          const data = await userService.getUserProfile();
          setUserProfile(data);
          setIsAuthenticated(true);

          // Load favorites from localStorage
          const storedFavorites = JSON.parse(localStorage.getItem('bookMyHostelFavorites')) || [];
          setFavorites(storedFavorites);
        } catch (error) {
          console.error("Session validation failed", error);
          authService.logout(); // Clear invalid session
          setIsAuthenticated(false);
          setUserProfile(null);
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

  const logout = () => {
    authService.logout();
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
    logout,
    favorites,
    toggleFavorite,
    isFavorited,
    setUserProfile, // Exposing for profile updates
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
import React, { useState, createContext, useEffect } from 'react';
import authService from '../../service/auth.service.js';
import userService from '../../service/user.service.js';
import favoriteService from '../../service/favorite.service.js';
import bookingService from '../../service/booking.service.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // On initial load, check localStorage for existing session
  useEffect(() => {
    const checkLoggedIn = async () => {
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const userData = JSON.parse(authData);
          if (userData.token) {
            setUserProfile(userData);
            setIsAuthenticated(true);
            
            // Load favorites and bookings from backend
            try {
              const favs = await favoriteService.getMyFavorites();
              setFavorites(favs);
            } catch (error) {
              console.error('Failed to load favorites:', error);
            }
            
            try {
              const bookings = await bookingService.getMyBookings();
              setBookingHistory(bookings);
            } catch (error) {
              console.error('Failed to load bookings:', error);
            }
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
    // Load favorites and bookings from backend on login
    try {
      const favs = await favoriteService.getMyFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
    
    try {
      const bookings = await bookingService.getMyBookings();
      setBookingHistory(bookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
    return userData;
  };

  const loginWithUserData = async (userData) => {
    setUserProfile(userData);
    setIsAuthenticated(true);
    localStorage.setItem('auth', JSON.stringify(userData));
    
    try {
      const favs = await favoriteService.getMyFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
    
    try {
      const bookings = await bookingService.getMyBookings();
      setBookingHistory(bookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    setUserProfile(null);
    setIsAuthenticated(false);
    setFavorites([]);
    setBookingHistory([]);
  };

  const toggleFavorite = async (hostelId) => {
    try {
      const isAlreadyFavorited = favorites.some(fav => fav.hostel && fav.hostel._id === hostelId);

      if (isAlreadyFavorited) {
        await favoriteService.removeFavorite(hostelId);
        setFavorites(favorites.filter(fav => fav.hostel && fav.hostel._id !== hostelId));
      } else {
        const newFavorite = await favoriteService.addFavorite(hostelId);
        setFavorites([...favorites, newFavorite]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  };

  const isFavorited = (hostelId) => {
    return favorites.some(fav => fav.hostel && fav.hostel._id === hostelId);
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
    bookingHistory,
    setBookingHistory
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
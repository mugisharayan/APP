import apiService from './api.service.js';

const custodianService = {
  // Create new hostel
  createHostel: async (hostelData) => {
    try {
      const response = await apiService.custodian.createHostel(hostelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create hostel');
    }
  },

  // Get my hostel
  getMyHostel: async () => {
    try {
      const response = await apiService.custodian.getMyHostel();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hostel');
    }
  },

  // Update hostel
  updateHostel: async (hostelData) => {
    try {
      const response = await apiService.custodian.updateHostel(hostelData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update hostel');
    }
  },

  // Get custodian dashboard data
  getDashboardData: async () => {
    try {
      const response = await apiService.custodian.getDashboardData();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  // Get custodian bookings
  getBookings: async () => {
    try {
      const response = await apiService.custodian.getBookings();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  // Get custodian payments
  getPayments: async () => {
    try {
      const response = await apiService.custodian.getPayments();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },

  // Get custodian profile
  getProfile: async () => {
    try {
      const response = await apiService.custodian.getProfile();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Update custodian profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiService.custodian.updateProfile(profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiService.custodian.changePassword(passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }
};

export default custodianService;
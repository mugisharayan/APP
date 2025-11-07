import apiService from './api.service.js';

const maintenanceService = {
  // Create maintenance request
  createMaintenanceRequest: async (requestData) => {
    try {
      const response = await apiService.post('/maintenance', requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create maintenance request');
    }
  },

  // Get user's maintenance requests
  getMyMaintenanceRequests: async () => {
    try {
      const response = await apiService.get('/maintenance/my-requests');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch maintenance requests');
    }
  }
};

export default maintenanceService;
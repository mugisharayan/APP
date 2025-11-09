import apiService from './api.service.js';

const custodianService = {
  // Link custodian to existing hostel
  linkToHostel: async (hostelName) => {
    try {
      const response = await apiService.custodian.linkHostel(hostelName);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to link to hostel');
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
  }
};

export default custodianService;
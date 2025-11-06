import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const userData = JSON.parse(auth);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth endpoints
  auth: {
    login: (email, password) => 
      axios.post(`${API_BASE_URL}/users/login`, { email, password }),
    
    register: (userData) => 
      axios.post(`${API_BASE_URL}/users/register`, userData),
    
    logout: () => 
      axios.post(`${API_BASE_URL}/users/logout`)
  },

  // User endpoints
  users: {
    getProfile: () => 
      axios.get(`${API_BASE_URL}/users/profile`),
    
    updateProfile: (userData) => 
      axios.put(`${API_BASE_URL}/users/profile`, userData)
  },

  // Hostel endpoints
  hostels: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/hostels`),
    
    getById: (id) => 
      axios.get(`${API_BASE_URL}/hostels/${id}`),
    
    create: (hostelData) => 
      axios.post(`${API_BASE_URL}/hostels`, hostelData),
    
    update: (id, hostelData) => 
      axios.put(`${API_BASE_URL}/hostels/${id}`, hostelData),
    
    delete: (id) => 
      axios.delete(`${API_BASE_URL}/hostels/${id}`)
  },

  // Booking endpoints
  bookings: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/bookings`),
    
    getById: (id) => 
      axios.get(`${API_BASE_URL}/bookings/${id}`),
    
    create: (bookingData) => 
      axios.post(`${API_BASE_URL}/bookings`, bookingData),
    
    update: (id, bookingData) => 
      axios.put(`${API_BASE_URL}/bookings/${id}`, bookingData),
    
    cancel: (id) => 
      axios.delete(`${API_BASE_URL}/bookings/${id}`)
  },

  // Payment endpoints
  payments: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/payments`),
    
    create: (paymentData) => 
      axios.post(`${API_BASE_URL}/payments`, paymentData),
    
    update: (id, paymentData) => 
      axios.put(`${API_BASE_URL}/payments/${id}`, paymentData)
  },

  // Maintenance endpoints
  maintenance: {
    getAll: () => 
      axios.get(`${API_BASE_URL}/maintenance`),
    
    create: (requestData) => 
      axios.post(`${API_BASE_URL}/maintenance`, requestData),
    
    update: (id, requestData) => 
      axios.put(`${API_BASE_URL}/maintenance/${id}`, requestData)
  }
};

export default apiService;
export { apiService };
import authService from './auth.service.js';

const API_URL = '/api/users';

/**
 * Gets the auth header with the JWT token.
 * @returns {HeadersInit}
 */
const authHeader = () => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

/**
 * Fetches the user profile from the backend.
 * @returns {Promise<any>}
 */
const getUserProfile = async () => {
  const response = await fetch(`${API_URL}/profile`, {
    headers: authHeader(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }

  return response.json();
};

// You can add other user-related services here, like updateUserProfile

const userService = {
  getUserProfile,
  
  // Update user profile
  updateUserProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  },
  
  // Change password
  changePassword: async (passwordData) => {
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    return response.json();
  },
  
  // Save booking profile data
  saveBookingProfile: async (bookingData) => {
    const profileData = {
      phone: bookingData.phone,
      gender: bookingData.gender,
      dateOfBirth: bookingData.dob,
      yearOfStudy: bookingData.yearOfStudy,
      studentNumber: bookingData.studentNumber,
      residence: bookingData.residence,
      nextOfKinName: bookingData.nextOfKinName,
      nextOfKinContact: bookingData.nextOfKinContact,
      guardianName: bookingData.guardianName,
      guardianContact: bookingData.guardianContact,
      profileCompleted: true
    };
    
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save profile');
    }

    return response.json();
  }
};

export default userService;
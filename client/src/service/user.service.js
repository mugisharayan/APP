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
};

export default userService;
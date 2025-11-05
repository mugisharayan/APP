const API_URL = '/api/users';

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 */
const login = async (email, password) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('csrf-token='))?.split('=')[1] || Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': token,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }

  const user = await response.json();
  if (user.token) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  return user;
};

/**
 * Logs out the current user by removing the user item from localStorage.
 */
const logout = () => {
  localStorage.removeItem('user');
};

/**
 * Gets the current user from localStorage.
 * @returns {any | null}
 */
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;
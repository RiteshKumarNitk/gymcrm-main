import axios from './axios';

export const registerUser = async (userData) => {
  const response = await axios.post('/api/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get('/api/users/me');
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await axios.put(`/api/users/${userId}/role`, { role });
  return response.data;
};
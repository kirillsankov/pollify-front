import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACK_LINK,
  withCredentials: true,
});

export const validateToken = async (token: string) => {
  try {
    const response = await apiClient.get('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.validate;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};
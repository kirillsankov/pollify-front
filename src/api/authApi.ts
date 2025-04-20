import axios from 'axios';
import { User } from '../types/inerfaces';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACK_LINK,
  withCredentials: true,
});

export const validateToken= async (token: string): Promise<boolean>  => {
  try {
    const response = await apiClient.get('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.validate;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

export const register = async ({username, password}: User): Promise<boolean> => {
  const response = await apiClient.post('/auth/register', {username, password});
  return response.data;
};
import { store } from '../store/store';
import { refreshToken } from './authApi';
import { setToken, logout } from '../store/authSlice';


export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
  const state = store.getState();
  const token = state.auth.token;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 401) {
      try {
        const refreshResponse = await refreshToken();

        if (refreshResponse.error || !refreshResponse.token) {
          store.dispatch(logout());
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
        store.dispatch(setToken(refreshResponse.token));

        headers['Authorization'] = `Bearer ${refreshResponse.token}`;
        
        const newResponse = await fetch(url, {
          ...options,
          headers,
          credentials: 'include'
        });

        if (newResponse.ok) {
          return await newResponse.json();
        } else {
          throw new Error('Request failed after token refresh');
        }
      } catch (error) {
        store.dispatch(logout());
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    return Promise.reject(new Error(errorData.message || `Request failed with status ${response.status}`));
  } catch (error) {
    return Promise.reject(error);
  }
};
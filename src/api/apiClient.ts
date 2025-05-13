import { store } from '../store/store';
import { refreshToken } from './authApi';
import { setToken, logout } from '../store/authSlice';

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const updateAuthState = (isAuthenticated: boolean) => {
  const event = new CustomEvent('auth-state-change', { 
    detail: { isAuthenticated } 
  });
  window.dispatchEvent(event);
};

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
      updateAuthState(true);
      return await response.json();
    }

    if (response.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken) => {
            headers['Authorization'] = `Bearer ${newToken}`;
            
            fetch(url, {
              ...options,
              headers,
              credentials: 'include'
            })
              .then(res => {
                if (res.ok) {
                  updateAuthState(true);
                  return res.json();
                }
                updateAuthState(false);
                throw new Error('The request failed after the token update');
              })
              .then(resolve)
              .catch(reject);
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await refreshToken();
        console.log(refreshResponse.token);

        if (refreshResponse.error || !refreshResponse.token) {
          refreshQueue = [];
          isRefreshing = false;
          store.dispatch(logout());
          updateAuthState(false);
          // return Promise.reject(new Error('The session is over. Please log in again.'));
        }

        store.dispatch(setToken(refreshResponse.token));
        updateAuthState(true);
        
        refreshQueue.forEach(callback => refreshResponse.token && callback(refreshResponse.token));
        refreshQueue = [];
        isRefreshing = false;

        headers['Authorization'] = `Bearer ${refreshResponse.token}`;
        
        const newResponse = await fetch(url, {
          ...options,
          headers,
          credentials: 'include'
        });

        if (newResponse.ok) {
          return await newResponse.json();
        } else {
          updateAuthState(false);
          throw new Error('The request failed after the token update');
        }
      } catch (error) {
        refreshQueue = [];
        isRefreshing = false;
        store.dispatch(logout());
        updateAuthState(false);
        // return Promise.reject(new Error('The session is over. Please log in again.'));
      }
    }

    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    return Promise.reject(new Error(errorData.message || `The request failed with the status ${response.status}`));
  } catch (error) {
    return Promise.reject(error);
  }
};
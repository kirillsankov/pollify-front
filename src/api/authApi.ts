import { User } from '../types/inerfaces';

export interface IResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
  access_token?: string;
  validate?: boolean;
}

const API_URL = process.env.REACT_APP_BACK_LINK;

const handleResponse = async (response: Response): Promise<any> => {
  const data = await response.json();  
  return data;
};

export const validateToken = async (token: string | null = null): Promise<boolean> => {
  try {
    if (!token) {
      return false;
    }
    
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    const data = await handleResponse(response);
    return data.validate || false;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

export const register = async ({ email, password }: User): Promise<IResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  });
  
  return await handleResponse(response);
};

export const verifyEmail = async (email: string, code: string): Promise<IResponse> => {
  const response = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, code }),
    credentials: 'include'
  });
  
  return await handleResponse(response);
};

export const resendVerifyEmailCode = async (email: string): Promise<IResponse> => {
  const response = await fetch(`${API_URL}/auth/resend-verification-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email }),
    credentials: 'include'
  });
  
  return await handleResponse(response);
};

export const forgotPassword = async (email: string): Promise<IResponse> => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email }),
    credentials: 'include'
  });
  
  return await handleResponse(response);
};

export const resetPassword = async (email: string, code: string, newPassword: string): Promise<IResponse> => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, code, newPassword }),
    credentials: 'include'
  });
  
  return await handleResponse(response);
};
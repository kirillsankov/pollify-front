import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { validateToken } from '../api/authApi';
import { logout } from '../store/authSlice';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any;
  status: string;
  isLoading: boolean;
  validateCurrentToken: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  status: 'idle',
  isLoading: false,
  validateCurrentToken: async () => false
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const defaultAuth = localStorage.getItem('isAuthLast') === 'true';
  const [auth, setAuth] = useState<boolean>(defaultAuth);
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const status = useSelector((state: RootState) => state.auth.status);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let validationInProgress = false;
  
  const validateCurrentToken = async (): Promise<boolean> => {
    if (!token) {
      localStorage.setItem('isAuthLast', 'false');
      setAuth(false);
      return false;
    }
    
    if (validationInProgress) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return auth;
    }
    
    try {
      validationInProgress = true;
      const isAuth = await validateToken(token);
      localStorage.setItem('isAuthLast', isAuth.toString());
      setAuth(isAuth);
      return isAuth;
    } finally {
      validationInProgress = false;
    }
  };
  
  useEffect(() => {
    validateCurrentToken();
  }, [token, location.pathname]);
  

  useEffect(() => {
    if(!localStorage.getItem('token')) {
      dispatch(logout());
      navigate('/login');
    }
  }, [localStorage.getItem('token')]);
  
  const authValue = {
    isAuthenticated: auth,
    token,
    user,
    status,
    isLoading: status === 'loading',
    validateCurrentToken // Экспортируем функцию для ручной проверки
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
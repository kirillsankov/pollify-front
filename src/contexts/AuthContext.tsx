import React, { createContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any;
  status: string;
  isLoading: boolean;
  setAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  status: 'idle',
  isLoading: false,
  setAuthenticated: () => {}
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
  
  const setAuthenticated = (value: boolean) => {
    localStorage.setItem('isAuthLast', value.toString());
    setAuth(value);
  };
  
  useEffect(() => {
    if (!token) {
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
  }, [token, location.pathname]);
  

  useEffect(() => {
    if(!localStorage.getItem('token') && token) {
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
    setAuthenticated
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface UnauthRouteProps {
  children: ReactNode;
}

export const UnauthRoute = ({ children }: UnauthRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <>{children}</>;
  }
  
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirect_to');
  
  const redirectPath = redirectTo || '/app/stats';
  
  return <Navigate to={redirectPath} replace />;
};
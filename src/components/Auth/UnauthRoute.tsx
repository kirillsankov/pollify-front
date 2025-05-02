import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface UnauthRouteProps {
  children: ReactNode;
}

export const UnauthRoute = ({ children }: UnauthRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/app/stats" replace />;
};
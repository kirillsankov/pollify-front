
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    const redirectTo = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?redirect_to=${redirectTo}`} replace />;
  }
  
  return <>{children}</>;
};
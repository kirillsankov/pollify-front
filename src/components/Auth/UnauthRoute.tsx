import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function UnauthRoute() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/app/stats" replace />;
  }
  
  return <Outlet />;
}

export default UnauthRoute;
import { Outlet } from 'react-router-dom';
import { Loader } from '../shared/index';
import { useAuth } from '../../hooks/useAuth';
import { LoginPage } from '../../pages/Auth/index';

function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Outlet />;
}

export default PrivateRoute;
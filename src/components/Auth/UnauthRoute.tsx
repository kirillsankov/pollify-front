import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { validateToken } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

function UnauthRoute() {
  const { token } = useAuth();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if(!token) {
      return;
    }
    const isAuthPromise = validateToken(token);
    isAuthPromise.then((isAuth) => {
      if (isAuth) {
        setIsValid(true);
      }
    });
  }, []);

  if (isValid) {
    return <Navigate to="/app/stats" replace />;
  }

  return <Outlet />;
};

export default UnauthRoute;
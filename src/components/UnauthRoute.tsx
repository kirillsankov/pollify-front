import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { validateToken } from '../api/authApi';

function UnauthRoute() {
  const token = useSelector((state: RootState) => state.auth.token) || localStorage.getItem('token');
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
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { validateToken } from '../api/authApi';
import Loader from './UI/Loader';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';

function PrivateRoute() {
  const { token } = useAuth();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const result = await validateToken(token);
        setIsValid(!!result);
      } else {
        setIsValid(false);
      }
    };

    checkToken();
  }, [token]);

  if (isValid === null) {
    return (
      <Loader/>
    );
  }

  if (!isValid) {
    return <LoginPage callBackSuccess={
      () => {
        setIsValid(true);
      }
    }/>;
  }

  return <Outlet />;
};

export default PrivateRoute;
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { validateToken } from '../api/authApi';

function PrivateRoute() {
  const token = useSelector((state: RootState) => state.auth.token) || localStorage.getItem('token');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
        console.log('checkToken', token);
      if (token) {
        const result = await validateToken(token);
        setIsValid(!!result);
        console.log('tok', result);
      } else {
        console.log(false);
        setIsValid(false);
      }
    };

    checkToken();
  }, [token]);

  if (isValid === null) {
    return <div>Authorization verification...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
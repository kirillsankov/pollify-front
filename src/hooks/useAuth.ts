import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { validateToken } from '../api/authApi';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const defaultAuth = localStorage.getItem('isAuthLast') === 'true';
    const [auth, setAuth] = useState<boolean>(defaultAuth);

    useEffect(() => {
        (async () => {
            const isAuth = await validateToken(token);
            localStorage.setItem('isAuthLast', isAuth.toString());
            setAuth(isAuth);
        })()
    })

    const token = useSelector((state: RootState) => state.auth.token);
    const user = useSelector((state: RootState) => state.auth.user);
    const status = useSelector((state: RootState) => state.auth.status);
  
    return {
        isAuthenticated: auth,
        token,
        user,
        status,
        isLoading: status === 'loading'
    };
};
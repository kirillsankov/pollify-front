import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { validateToken } from '../api/authApi';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const defaultAuth = localStorage.getItem('isAuthLast') === 'true';
    const [auth, setAuth] = useState<boolean>(defaultAuth);
    const token = useSelector((state: RootState) => state.auth.token);
    const user = useSelector((state: RootState) => state.auth.user);
    const status = useSelector((state: RootState) => state.auth.status);

    useEffect(() => {
        let isMounted = true;
        
        const checkAuth = async () => {
            if (token) {
                const isAuth = await validateToken(token);
                if (isMounted) {
                    localStorage.setItem('isAuthLast', isAuth.toString());
                    setAuth(isAuth);
                }
            } else {
                if (isMounted) {
                    localStorage.setItem('isAuthLast', 'false');
                    setAuth(false);
                }
            }
        };
        
        checkAuth();
        
        return () => {
            isMounted = false;
        };
    }, [token]);
  
    return {
        isAuthenticated: auth,
        token,
        user,
        status,
        isLoading: status === 'loading'
    };
};
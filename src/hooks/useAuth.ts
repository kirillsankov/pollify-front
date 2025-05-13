import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    const handleAuthStateChange = (event: CustomEvent) => {
      authContext.setAuthenticated(event.detail.isAuthenticated);
    };
    
    window.addEventListener('auth-state-change', handleAuthStateChange as EventListener);
    
    return () => {
      window.removeEventListener('auth-state-change', handleAuthStateChange as EventListener);
    };
  }, [authContext]);
  
  return authContext;
};
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  // Optional: keep localStorage in sync
  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  const login = (userData) => {
    setAuth(userData);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return {
    auth,
    login,
    logout,
    isAuthenticated: !!auth,
  };
};

export default useAuth;

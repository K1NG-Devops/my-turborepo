import { useState, useEffect } from 'react';

const useAuth = () => {
  const [auth, setAuth] = useState(() => {
    // Check for auth data in localStorage
    const stored = localStorage.getItem('auth');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Fallback: construct auth from individual localStorage items
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        return {
          token,
          user: userData,
          role: role || userData.role
        };
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    return null;
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  const login = (userData) => {
    console.log('useAuth - Setting auth data:', userData);
    setAuth(userData);
  };

  const logout = () => {
    setAuth(null);
    // Clear all auth-related localStorage items
    localStorage.removeItem('auth');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('parent_id');
    localStorage.removeItem('teacherId');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isTeacher');
  };

  return {
    auth,
    login,
    logout,
    isAuthenticated: !!auth,
    isTeacher: auth?.role === 'teacher' || localStorage.getItem('role') === 'teacher',
    isAdmin: auth?.role === 'admin' || localStorage.getItem('role') === 'admin',
    isParent: auth?.role === 'parent' || auth?.role === 'user' || (!auth?.role && localStorage.getItem('parent_id'))
  };
};

export default useAuth;

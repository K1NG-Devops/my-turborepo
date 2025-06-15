import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
    const { isAuthenticated, isTeacher, isParent, auth } = useAuth();
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    
    // Debug logging
    console.log('PrivateRoute - Auth state:', {
        isAuthenticated,
        isTeacher,
        isParent,
        auth,
        token: !!token,
        role
    });
    
    // Check both auth context and localStorage for backward compatibility
    const isLoggedIn = isAuthenticated || !!token;
    
    if (!isLoggedIn) {
        console.log('PrivateRoute - User not logged in, redirecting...');
        // Redirect to appropriate login page based on role
        if (role === 'teacher') {
            return <Navigate to='/teacher-login' replace />;
        }
        return <Navigate to='/login' replace />;
    }

    console.log('PrivateRoute - User authenticated, allowing access');
    return <Outlet />;
};

export default PrivateRoute;

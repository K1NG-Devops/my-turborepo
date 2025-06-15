import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
    const { isAuthenticated, isTeacher, isParent } = useAuth();
    const token = localStorage.getItem('accessToken');
    
    // Check both auth context and localStorage for backward compatibility
    const isLoggedIn = isAuthenticated || !!token;
    
    if (!isLoggedIn) {
        // Redirect to appropriate login page based on role
        const role = localStorage.getItem('role');
        if (role === 'teacher') {
            return <Navigate to='/teacher-login' replace />;
        }
        return <Navigate to='/login' replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;

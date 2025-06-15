import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    const token = localStorage.getItem('accessToken');
    
    // Check both auth context and localStorage for backward compatibility
    const isLoggedIn = isAuthenticated || !!token;

    return isLoggedIn ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;

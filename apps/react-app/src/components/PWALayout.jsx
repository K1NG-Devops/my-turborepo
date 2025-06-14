import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaBell, FaUser, FaChalkboardTeacher, FaExternalLinkAlt, FaCog } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import usePWA from '../hooks/usePWA';
import { toast } from 'react-toastify';

// Import dashboard components
import PWAParentDashboard from './PWA/PWAParentDashboard';
import PWATeacherDashboard from './PWA/PWATeacherDashboard';
import SubmitWork from '../pages/ParentDashboard/SubmitWork';
import Notifications from '../pages/ParentDashboard/Notifications';
import Login from '../components/Login';
import TeacherLogin from '../components/Teacher/TeacherLogin';
import NotificationManager from './NotificationManager';

const PWALayout = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { openFullWebsite } = usePWA();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check authentication on mount
  useEffect(() => {
    if (!auth?.user) {
      // If not authenticated, show login based on stored role preference
      const preferredRole = localStorage.getItem('preferredRole') || 'parent';
      if (preferredRole === 'teacher') {
        navigate('/teacher-login');
      } else if (preferredRole === 'admin') {
        navigate('/admin-login');
      } else {
        navigate('/login');
      }
    }
  }, [auth?.user, navigate]);

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleOpenWebsite = () => {
    openFullWebsite();
    toast.info('Opening full website in browser...');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const role = auth?.user?.role;
    
    if (role === 'teacher') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/teacher-dashboard' },
        { id: 'homework', label: 'Homework', icon: FaBook, path: '/teacher-dashboard' },
        { id: 'notifications', label: 'Notifications', icon: FaBell, path: '/notifications' },
      ];
    } else if (role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/admin-dashboard' },
        { id: 'notifications', label: 'Notifications', icon: FaBell, path: '/notifications' },
      ];
    } else {
      // Parent role or no role
      return [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/dashboard' },
        { id: 'homework', label: 'Homework', icon: FaBook, path: '/student/homework' },
        { id: 'notifications', label: 'Notifications', icon: FaBell, path: '/notifications' },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* PWA Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Circular Logo */}
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
              <img 
                src="/pwa-192x192.png" 
                alt="Young Eagles Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold">Young Eagles</h1>
              <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">App</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notification Test Button (Development) */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => {
                  if (window.youngEaglesNotifications) {
                    window.youngEaglesNotifications.test();
                  } else {
                    console.log('⚠️ Notification system not ready yet');
                  }
                }}
                className="p-2 hover:bg-blue-500 rounded-lg transition-colors duration-200"
                title="Test Notifications"
              >
                <FaBell className="text-sm" />
              </button>
            )}
            
            {/* Open Website Button */}
            <button
              onClick={handleOpenWebsite}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors duration-200"
              title="Open full website"
            >
              <FaExternalLinkAlt className="text-sm" />
            </button>
            
            {/* Settings/Profile Button */}
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <FaUser className="text-sm" />
            </button>
          </div>
        </div>
        
        {/* User info */}
        {auth?.user && (
          <div className="mt-2 text-sm opacity-90">
            Welcome, {auth.user.name || auth.user.email}
            <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded">
              {auth.user.role}
            </span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/admin-login" element={<Login />} />
          
          {/* Protected Routes */}
          {auth?.user ? (
            <>
              {/* Parent Routes */}
              {auth.user.role === 'parent' && (
                <>
                  <Route path="/dashboard" element={<PWAParentDashboard />} />
                  <Route path="/student/homework" element={<SubmitWork />} />
                  <Route path="/notifications" element={<Notifications />} />
                </>
              )}
              
              {/* Teacher Routes */}
              {auth.user.role === 'teacher' && (
                <>
                  <Route path="/teacher-dashboard" element={<PWATeacherDashboard />} />
                  <Route path="/notifications" element={<Notifications />} />
                </>
              )}
              
              {/* Admin Routes */}
              {auth.user.role === 'admin' && (
                <>
                  <Route path="/admin-dashboard" element={<div className="p-4">Admin Dashboard Coming Soon</div>} />
                  <Route path="/notifications" element={<Notifications />} />
                </>
              )}
              
              {/* Default redirect based on role */}
              <Route path="/" element={
                <Navigate to={
                  auth.user.role === 'teacher' ? '/teacher-dashboard' :
                  auth.user.role === 'admin' ? '/admin-dashboard' :
                  '/dashboard'
                } replace />
              } />
            </>
          ) : (
            <Route path="/*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </main>

      {/* Bottom Navigation */}
      {auth?.user && (
        <nav className="bg-white border-t border-gray-200 p-2">
          <div className="flex justify-around">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    navigate(item.path);
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="text-lg mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
      
      {/* WhatsApp/Facebook-style Notifications */}
      <NotificationManager />
    </div>
  );
};

export default PWALayout;


import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaBell, FaUser, FaChalkboardTeacher, FaExternalLinkAlt, FaCog, FaGlobe, FaComments } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import usePWA from '../hooks/usePWA';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { toast } from 'react-toastify';

// Import dashboard components
import PWAParentDashboard from './PWA/PWAParentDashboard';
import PWATeacherDashboard from './PWA/PWATeacherDashboard';
import SubmitWork from '../pages/ParentDashboard/SubmitWork';
import HomeworkList from '../pages/HomeworkList';
import Notifications from '../pages/ParentDashboard/Notifications';
import Login from '../components/Login';
import Register from '../components/Parents/Register';
import PasswordReset from '../components/PasswordReset';
import TeacherLogin from '../components/Teacher/TeacherLogin';
import AuthTest from '../components/AuthTest';
import MessagingCenter from './Messaging/MessagingCenter';
import PrivateRoutePWA from './PWA/PrivateRoutePWA';

const PWALayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const { openFullWebsite } = usePWA();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    // Check both auth context and localStorage
    if (!auth?.user && !token) {
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

  // Sync navigation tab with current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('/student/homework') || currentPath.includes('/homework')) {
      setActiveTab('homework');
    } else if (currentPath.includes('/messages')) {
      setActiveTab('messages');
    } else if (currentPath.includes('/notifications')) {
      setActiveTab('notifications');
    } else if (currentPath.includes('/dashboard')) {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleOpenWebsite = async () => {
    const isNativeApp = Capacitor.isNativePlatform();
    
    if (isNativeApp) {
      // For native app, open the full website in external browser
      try {
        await Browser.open({ 
          url: 'https://youngeagles-homework-app.vercel.app/',
          windowName: '_system'
        });
        toast.info('Opening full website in browser...');
      } catch (error) {
        console.error('Error opening browser:', error);
        // Fallback to window.open
        window.open('https://youngeagles-homework-app.vercel.app/', '_system');
        toast.info('Opening full website in browser...');
      }
    } else {
      // For PWA, use the existing function
      openFullWebsite();
      toast.info('Opening full website in browser...');
    }
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    // Get user role with fallback to localStorage for PWA compatibility
    const role = auth?.user?.role || localStorage.getItem('role');
    const isTeacher = role === 'teacher' || localStorage.getItem('isTeacher') === 'true';
    const isAdmin = role === 'admin' || localStorage.getItem('isAdmin') === 'true';
    
    console.log('PWA Navigation - Auth state:', {
      role,
      isTeacher,
      isAdmin,
      authUserRole: auth?.user?.role,
      localStorageRole: localStorage.getItem('role'),
      localStorageIsTeacher: localStorage.getItem('isTeacher'),
      localStorageIsAdmin: localStorage.getItem('isAdmin')
    });
    
    if (isTeacher) {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/teacher-dashboard' },
        { id: 'homework', label: 'Homework', icon: FaBook, path: '/teacher/homework-list' },
        { id: 'messages', label: 'Messages', icon: FaComments, path: '/messages' },
        { id: 'notifications', label: 'Notifications', icon: FaBell, path: '/notifications' },
      ];
    } else if (isAdmin) {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/admin-dashboard' },
        { id: 'messages', label: 'Messages', icon: FaComments, path: '/messages' },
        { id: 'notifications', label: 'Notifications', icon: FaBell, path: '/notifications' },
      ];
    } else {
      // Parent role or no role
      return [
        { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/dashboard' },
        { id: 'homework', label: 'Homework', icon: FaBook, path: '/student/homework' },
        { id: 'messages', label: 'Messages', icon: FaComments, path: '/messages' },
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
                src="/app-icons/yehc_logo.png" 
                alt="Young Eagles Home Care Centre Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold">Young Eagles</h1>
              <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">App</span>
              <span className="text-xs bg-green-500 px-2 py-1 rounded-full">v1.0</span>
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
          <Route path="/register" element={<Register />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/admin-login" element={<Login />} />
          <Route path="/auth-test" element={<AuthTest />} />
          
          {/* PWA Protected Routes - Use PrivateRoutePWA */}
          <Route element={<PrivateRoutePWA />}>
            <Route path="/dashboard" element={<PWAParentDashboard />} />
            <Route path="/student/homework" element={<HomeworkList />} />
            <Route path="/submit-work" element={<SubmitWork />} />
            <Route path="/messages" element={<MessagingCenter />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/teacher-dashboard" element={<PWATeacherDashboard />} />
            <Route path="/teacher/homework-list" element={<HomeworkList />} />
            <Route path="/admin-dashboard" element={<div className="p-4">Admin Dashboard Coming Soon</div>} />
          </Route>

          {/* Default redirect for unauthenticated users */}
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      {auth?.user && (
        <nav className="bg-white border-t border-gray-200 p-2 mobile-nav-safe">
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
      
    </div>
  );
};

export default PWALayout;


import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PWALayout from './components/PWALayout';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Dashboard from './pages/ParentDashboard/Dashboard';
import PopUploadForm from './components/Parents/PopUploadForm';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import TeacherLogin from './components/Teacher/TeacherLogin';
import Register from './components/Parents/Register';
import RegisterChild from './components/Parents/RegisterChild';
import Lessons from './pages/ParentDashboard/Lessons';
import Notifications from './pages/ParentDashboard/Notifications';
import Resources from './pages/ParentDashboard/Resources';
import Videos from './pages/ParentDashboard/Videos';
import TeacherDashboard from './pages/TeacherDashboard/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import TeacherChildrenList from './components/Teacher/TeacherChildrenList';
import AttendancePage from "./components/Teacher/AttendancePage";
import AutoLogout from './components/AutoLogout';
import HomeworkList from './pages/HomeworkList';
import UploadHomework from './pages/TeacherDashboard/UploadHomework';
import SubmitWork from './pages/ParentDashboard/SubmitWork';
import { Toaster } from 'sonner';
import AOS from 'aos';
import NotificationPermission from './components/NotificationPermission';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import TeacherActivityBuilder from './pages/TeacherDashboard/TeacherActivityBuilder';
import FirebaseActionHandler from './components/FirebaseActionHandler';
import PasswordReset from './components/PasswordReset';
import PasswordlessLogin from './components/PasswordlessLogin';
import PhoneLogin from './components/PhoneLogin';
import usePWA from './hooks/usePWA';
import PWADebugIndicator from './components/PWADebugIndicator';
import NotificationManager from './components/NotificationManager';
import './App.css';

// Lazy import new components with fallbacks
const DownloadApp = React.lazy(() => 
  import('./pages/DownloadApp').catch(() => ({ 
    default: () => <div className="p-4 text-center">Download page temporarily unavailable</div> 
  }))
);

// Check for Capacitor availability
const isCapacitorAvailable = (() => {
  try {
    const { Capacitor } = require('@capacitor/core');
    return Capacitor;
  } catch {
    return null;
  }
})();

function App() {
  const { isStandalone: isPWAStandalone } = usePWA();
  
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Check if running as native Capacitor app
  const isNativeApp = isCapacitorAvailable ? isCapacitorAvailable.isNativePlatform() : false;
  
  // Force PWA mode for testing - you can remove this line after testing
  const isStandalone = isPWAStandalone || isNativeApp; // Re-enabled PWA mode with bottom navigation

  // Check if URL has source=pwa parameter to force web view
  const urlParams = new URLSearchParams(window.location.search);
  const forceWebView = urlParams.get('source') === 'pwa' && !isNativeApp; // Don't force web view for native app

  return (
    <Router>
      <AutoLogout>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            success: {
              className: 'bg-green-500 text-white',
              style: {
                backgroundColor: '#4CAF50',
                color: '#fff',
              },
            },
            error: {
              className: 'bg-red-500 text-white',
              style: {
                backgroundColor: '#F44336',
                color: '#fff',
              },
            },
          }}
          expand
        />
        
        {/* Render PWA Layout when in standalone mode, otherwise use regular web layout */}
        {isStandalone && !forceWebView ? (
          <PWALayout />
        ) : (
          <Routes>
{/* Public Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/programs" element={<Programs />} />
            </Route>

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher-login" element={<TeacherLogin />} />
            <Route path="/admin-login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/passwordless-login" element={<PasswordlessLogin />} />
            <Route path="/phone-login" element={<PhoneLogin />} />
            <Route path="/auth/action" element={<FirebaseActionHandler />} />
            <Route path="/download" element={
              <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                <DownloadApp />
              </React.Suspense>
            } />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/popupload" element={<PopUploadForm />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/student/homework" element={<HomeworkList />} />
              <Route path="/submit-work" element={<SubmitWork />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/view-attendance" element={<AttendancePage />} />
              <Route path="/teacher-children-list" element={<TeacherChildrenList />} />
              <Route path="/homework/upload" element={<UploadHomework />} />
              <Route path="/register-child" element={<RegisterChild />} />
              <Route path="/teacher-dashboard/activity-builder" element={<TeacherActivityBuilder />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<div className="p-4 text-center">404 Not Found</div>} />
          </Routes>
        )}
        
        {/* PWA and Notification Components - only show for web view */}
        {!isStandalone && (
          <>
            <NotificationPermission />
            <PWAInstallPrompt />
          </>
        )}
        
        {/* PWA Debug Indicator - shows in both modes during development */}
        <PWADebugIndicator />
        
        {/* WhatsApp/Facebook-style Notifications - available in both PWA and web */}
        <NotificationManager />
      </AutoLogout>
    </Router>
  );
}

export default App;

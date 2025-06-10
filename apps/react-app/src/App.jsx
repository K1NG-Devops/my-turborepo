import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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
import './App.css';

function App() {

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
        <Routes>
          {/* Public Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />

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
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
        
        {/* PWA and Notification Components */}
        <NotificationPermission />
        <PWAInstallPrompt />
      </AutoLogout>
    </Router>

  );
}

export default App;

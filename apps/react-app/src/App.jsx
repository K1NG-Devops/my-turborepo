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
import AdminLogin from './components/AdminLogin';
import Register from './components/Parents/Register';
import RegisterChild from './components/Parents/RegisterChild';
import Lessons from './pages/ParentDashboard/Lessons';
import Notifications from './pages/ParentDashboard/Notifications';
import Resources from './pages/ParentDashboard/Resources';
import Videos from './pages/ParentDashboard/Videos';
import TeacherDashboard from './pages/TeacherDashboard/TeacherDashboard';
import AdminDashboardLayout from './pages/AdminDashboard/AdminDashboardLayout';
import TeacherChildrenList from './components/Teacher/TeacherChildrenList';
import AttendancePage from "./components/Teacher/AttendancePage";
import AutoLogout from './components/AutoLogout';
import HomeworkList from './pages/HomeworkList';
import UploadHomework from './pages/TeacherDashboard/UploadHomework';
import SubmitWork from './pages/ParentDashboard/SubmitWork';
import { Toaster } from 'sonner';
import AOS from 'aos';
import TeacherEventUpload from './components/Teacher/TeacherEventUpload';
import YearPlanner from './pages/YearPlanner';
import AdminEventsGrid from './pages/AdminDashboard/AdminEventsGrid';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

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
            <Route path="/home" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          {/* <Route path="/principal/login" element={<PrincipalLogin />} /> */}
          <Route path="/admin/login" element={<AdminLogin />} />

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
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<AdminEventsGrid />} />
            </Route>
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/view-attendance" element={<AttendancePage />} />
            <Route path="/teacher-children-list" element={<TeacherChildrenList />} />
            <Route path="/homework/upload" element={<UploadHomework />} />
            <Route path="/register-child" element={<RegisterChild />} />
            <Route path="/teacher/events/upload" element={<TeacherEventUpload />} />
            <Route path="/year-planner" element={<YearPlanner />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<div className='flex justify-center text-2xl font-bold text-red-500 items-center h-screen'>404 Not Found</div>} />
        </Routes>
      </AutoLogout>
    </Router>

  );
}

export default App;

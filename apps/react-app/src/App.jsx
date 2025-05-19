import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Dashboard from './pages/Dashboard';
import PopUploadForm from './components/PopUploadForm';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import TeacherLogin from './components/TeacherLogin';
import Register from './components/Register';
import RegisterChild from './components/RegisterChild';
import Attendance from './pages/Attendance';
import Homework from './pages/Homework';
import Lessons from './pages/Lessons';
import Notifications from './pages/Notifications';
import Resources from './pages/Resources';
import Videos from './pages/Videos';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        {/* Routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />

        {/* Protected routes wrapped with PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/popupload" element={<PopUploadForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/attendance" element={<div>Attendance</div>} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin-dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="/register-child" element={<RegisterChild />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

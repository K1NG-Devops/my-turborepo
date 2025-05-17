import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Dashboard from './pages/Dashboard';
import PopUploadForm from './components/PopUploadForm';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import RegisterChild from './pages/RegisterChild';
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        {/* Routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/home/programs" element={<Programs />} />
        </Route>

        {/* Public routes */}
        <Route path="/home/login" element={<Login />} />
        <Route path="/home/register" element={<Register />} />

        {/* Protected routes wrapped with PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/home/dashboard" element={<Dashboard />} />
          <Route path="/home/popupload" element={<PopUploadForm />} />
          <Route path="/home/register-child" element={<RegisterChild />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

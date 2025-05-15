import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://y.e.youngeagles.org.za/api/auth/login", { email, password });
      localStorage.setItem('token', response.data.token);
      setSuccessMessage('Login successful!');
      setErrorMessage('');
      window.location.href = '/parent';
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Invalid email or password.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Parent Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <p className="text-center mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
      </p>
      <div className='text-center mb-4'>
        <div className='flex flex-col items-center text-left bg-pink-100 p-4 rounded-lg shadow-md w-full mt-6'>
          <p className="text-center mb-4">If you are a student, please login <a href="/student/login" className="text-blue-500">here</a>.</p>
          <p className="text-center mb-4">If you are a teacher, please login <a href="/teacher/login" className="text-blue-500">here</a>.</p>
          <p className="text-center mb-4">If you are a school admin, please login <a href="/admin/login" className="text-blue-500">here</a>.</p>
          <p className="text-center mb-4">If you are a school principal, please login <a href="/principal/login" className="text-blue-500">here</a>.</p>

        </div>
      </div>
    </div>
  );
};

export default Login;
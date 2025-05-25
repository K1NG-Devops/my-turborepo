import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // ✅ fix import

const Login = () => {
  const { login } = useAuth(); // from custom hook
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://youngeagles-api-server.up.railway.app/api/auth/login",
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;
      login(data); // save to auth context
      localStorage.setItem('parent_id', data.user.id); // optional, if needed for later requests
      localStorage.setItem('token', data.token); // optional, if needed for later requests
      setSuccessMessage('Login successful!');
      setErrorMessage('');
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Invalid email or password.');
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/736x/9d/9f/18/9d9f18a89989da838bbc6f63bec8967b.jpg)',
      }}
    >
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Parent Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/4 -translate-y-1/2 text-sm text-white-600 cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {errorMessage && <p className="text-red-600 text-sm mt-2 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 text-sm mt-2 text-center">{successMessage}</p>}

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          Don't have an account? <Link to="/register" className="text-blue-500 underline">Register here</Link>
        </p>

        <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-700/80 p-4 rounded">
          <p className="text-center mb-2">Are you logging in as:</p>
          <ul className="space-y-1">
            <li className="text-center"><a href="/principal/login" className="text-blue-500">Principal</a></li>
            <li className="text-center"><a href="/teacher/login" className="text-blue-500">Teacher</a></li>
            <li className="text-center"><a href="/admin/login" className="text-blue-500">School Admin</a></li>
          </ul>
          <p className="text-center">
            <a href="/home" className="text-white-600">Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

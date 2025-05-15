import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    workAddress: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setMessage('');

    try {
      const response = await axios.post('https://y.e.youngeagles.org.za/api/auth/register', formData);
      setMessage(response.data.message);
      setFormData({ name: '', email: '', phone: '', password: '' });
    } catch (err) {
      setErrors(err.response?.data?.message || 'Registration failed');
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }
  , [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50">
      <div>
      <img className="h-full w-full object-cover" src="https://i.pinimg.com/736x/9d/9f/18/9d9f18a89989da838bbc6f63bec8967b.jpg" />

      </div>
      <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Parent Registration</h2>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700">Home Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700">Work Address</label>
          <input
            type="text"
            name="workAddress"
            value={formData.workAddress}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

      <div className="mt-4">
        <p className="text-center text-gray-600">
          By registering, you agree to our <a href="/terms" className="text-blue-600">Terms of Service</a> and <a href="/privacy" className="text-blue-600">Privacy Policy</a>.
        </p>
    </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
        {message && <p className="text-green-600 mb-3">{message}</p>}
        {errors && <p className="text-red-600 mb-3">{errors}</p>}
        <p className="text-center">
          Already have an account? <a href="/home/login" className="text-blue-600">Login here</a>
        </p>
        <p className="text-center">
          <a href="/home" className="text-blue-600">Back to Home</a>
        </p>
      </form>
    </div>

    </div>
  );
};

export default Register;

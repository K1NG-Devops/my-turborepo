import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { teacherLogin } from "../auth.js";
import useAuth from "../../hooks/useAuth";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login, isTeacher, isAuthenticated } = useAuth();

  // Redirect if already logged in as teacher
  useEffect(() => {
    if (isAuthenticated && isTeacher) {
      navigate('/teacher-dashboard', { replace: true });
    }
  }, [isAuthenticated, isTeacher, navigate]);

  // Handles input changes for email and password
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  // Toggles password visibility
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
  
    try {
      const result = await teacherLogin(email, password);
      console.log('Teacher login result:', result);
    
      if (result.success) {
        // Update auth context with teacher data
        const authData = {
          token: result.token,
          user: result.user,
          role: 'teacher'
        };
        
        console.log('Setting auth data:', authData);
        login(authData);
        
        setSuccess("Login successful!");
        toast.success("Login successful!");
        
        // Navigate with replace to prevent back button issues
        setTimeout(() => {
          console.log('Navigating to teacher dashboard');
          navigate("/teacher-dashboard", { replace: true });
        }, 500); // Increased timeout to ensure auth state is updated
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 dark:text-white flex items-center justify-center px-4 safe-area-inset">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Teacher Login
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={handleShowPassword}
              className="absolute right-3 top-[50%] transform -translate-y-[50%] text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button
            onClick={() => navigate("/login")}
            type="button"
            className="mt-6 w-full bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-700 transition cursor-pointer"
          >
            Back to Parent Login
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          If you don't have an account, please contact the admin to create one.
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;

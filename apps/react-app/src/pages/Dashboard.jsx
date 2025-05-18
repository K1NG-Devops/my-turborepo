// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardTile from '../components/DashboardTile';
import useAuth from '../hooks/useAuth';
import { FaBook, FaCalendarCheck, FaClipboardList, FaVideo, FaChalkboardTeacher, FaBell } from 'react-icons/fa';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const userName = auth?.user?.name || 'Parent';
  const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp';
  const userProfilePic =
    auth?.user?.profilePic && auth.user.profilePic !== 'null'
      ? auth.user.profilePic
      : defaultAvatar;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/home');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Hamburger menu (mobile only) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 sm:hidden sm:p-0 text-white bg-gray-800 rounded focus:outline-none"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z"
          />
        </svg>
      </button>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
      >
        <div className="h-full p-4 flex flex-col justify-between">
          <div>
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={userProfilePic}
                alt="User Avatar"
                className="w-20 h-20 rounded-full border"
              />
              <p className="mt-2 font-semibold">{userName}</p>
              <div className="relative mt-2" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-sm text-gray-600 hover:underline "
                >
                  ▼ Options
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Links */}
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className={`block px-4 py-2 rounded hover:bg-gray-200 ${location.pathname === '/dashboard' ? 'bg-gray-200 font-bold' : ''
                      }`}
                  >
                    Dashboard
                  </Link>
                </li>                
                <li>
                  <Link
                    to="/attendance"
                    className={`block px-4 py-2 rounded hover:bg-gray-200 ${location.pathname === '/attendance' ? 'bg-gray-200 font-bold' : ''
                      }`}
                  >
                    Attendance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className={`block px-4 py-2 rounded hover:bg-gray-200 ${location.pathname === '/resources' ? 'bg-gray-200 font-bold' : ''
                      }`}
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/videos"
                    className={`block px-4 py-2 rounded hover:bg-gray-200 ${location.pathname === '/videos' ? 'bg-gray-200 font-bold' : ''
                      }`}
                  >
                    Videos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lessons"
                    className={`block px-4 py-2 rounded hover:bg-gray-200 ${location.pathname === '/lessons' ? 'bg-gray-200 font-bold' : ''
                      }`}
                  >
                    Lessons
                  </Link>
                </li>
                <li>
                  <Link
                    to="/homework"
                    className={`block px-4 py-2 rounded hover:bg-gray-200 ${location.pathname === '/register-child' ? 'bg-gray-200 font-bold' : ''
                      }`}
                  >
                    Register Child
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      {/* Page Content */}
      <main className="sm:ml-64 p-4 min-h-screen bg-gray-300 transition-all duration-300 ease-in-out flex-col flex">
        <div className="flex justify-end mb-4">
          <h1 className="md:text-xl text-base font-bold">Welcome, {userName} 👋</h1>
        </div>
        {/* Dashboard tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardTile
            label="Homework"
            icon={<FaBook />}
            color="bg-yellow-200"
            to="/homework"
          />
          <DashboardTile
            label="Attendance"
            icon={<FaCalendarCheck />}
            color="bg-green-200"
            to="/attendance"
          />
          <DashboardTile
            label="Resources"
            icon={<FaClipboardList />}
            color="bg-blue-300"
            to="/resources"
          />
          <DashboardTile
            label="Videos"
            icon={<FaVideo />}
            color="bg-purple-300"
            to="/videos"
          />
          <DashboardTile
            label="Lessons"
            icon={<FaChalkboardTeacher />}
            color="bg-pink-300"
            to="/lessons"
          />
          <DashboardTile
            label="Notices"
            icon={<FaBell />}
            color="bg-red-200"
            to="/notices"
          />
        </div>

        <div className="mt-6">
          <h2 className="text-md font-semibold cursor-pointer mb-4"><Link to='activities'>Recent Activities</Link></h2>
          {/* Add your recent activities component here */}
        </div>
        <div className="mt-6">
          <h2 className="text-md font-semibold cursor-pointer mb-4"><Link to='notifications'>Notifications</Link></h2>
          {/* Add your notifications component here */}
        </div>
        <div className="mt-6">
          <h2 className="text-md font-semibold cursor-pointer mb-4"><Link to='messages'>Messages</Link></h2>
          {/* Add your messages component here */}
        </div>
      </main>
    </>
  );
};

export default Dashboard;

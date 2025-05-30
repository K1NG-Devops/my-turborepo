// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardTile from '../../components/DashboardTile';
import useAuth from '../../hooks/useAuth';
import { FaBook, FaCalendarCheck, FaClipboardList, FaVideo, FaChalkboardTeacher, FaBell } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeworkList from '../../pages/HomeworkList';

const linkStyles = "block mb-2 px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-800 hover:text-gray-800";
const linkStyles2 = "bg-cyan-800 font-bold text-white hover:bg-cyan-700 transition-colors duration-200";
const linkStylesActive = "bg-pink-500 font-bold text-gray-800";

const className = localStorage.getItem('className') || 'Class 1';
const grade = localStorage.getItem('grade') || 'Grade 1';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const [homeworkList, setHomeworkList] = useState([]);

  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (!auth?.user) {
      toast.error('Please log in to access the dashboard.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      navigate('/login');
    }
  }, [auth, navigate]);

  const userName = auth?.user?.name || 'Parent';
  const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp';
  const userProfilePic =
    auth?.user?.profilePic && auth.user.profilePic !== 'null'
      ? auth.user.profilePic
      : defaultAvatar;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
      window.location.reload();
    }, 1000);
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
        className="fixed top-4 left-4 z-50 sm:hidden sm:p-0 text-white bg-cyan-800 rounded focus:outline-none"
      >
        {isSidebarOpen ? (
          // X icon
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 
           1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 
           1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 
           10 4.293 5.707a1 1 0 010-1.414z"
            />
          </svg>
        ) : (
          // Hamburger icon
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 
           4h14a1 1 0 110 2H3a1 1 0 110-2zm0 
           4h14a1 1 0 110 2H3a1 1 0 110-2z"
            />
          </svg>
        )}
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
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-cyan-300 shadow transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                    className={`${linkStyles} ${linkStylesActive} ${location.pathname === '/dashboard' ? linkStyles2 : ''
                      }`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/attendance"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''
                      }`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                  >
                    📅 Attendance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''}`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="200"
                  >
                    📂 Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/videos"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''}`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="400"
                  >
                    🎥 Videos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lessons"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''}`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="600"
                  >
                    📚 Lessons
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register-child"
                    className={`${linkStyles} ${location.pathname === '/dashboard' ? linkStyles2 : ''
                      }`}
                    data-aos="fade-right"
                    data-aos-duration="500"
                    data-aos-delay="800"
                  >
                    👶 Register Child
                  </Link>
                </li>
              </ul>
              <Link
                to="/popupload"
                className="ml-2 inline-block px-8 mt-5 bg-pink-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-pink-600 transition"
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="1000"
              >
                Upload POP
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      <main className="sm:ml-64 p-4 min-h-screen bg-gray-300 transition-all duration-300 ease-in-out flex flex-col">
        <div className="flex justify-end mb-4 bg-gray-700 shadow-lg rounded-lg p-4 text-white w-full">
          <div className="flex items-center space-x-4">
            <Link
              to="/home"
              className="text-gray-300 hover:text-white bg-red-500 py-2 px-4 hover:bg-red-800 rounded-lg font-medium"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Dashboard tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardTile
            label="Homework"
            icon={<FaBook />}
            color="bg-yellow-200"
            to={`/student/homework?className=${encodeURIComponent(className)}&grade=${encodeURIComponent(grade)}`}

            isActive={true}
          />
          <DashboardTile
            label="Attendance"
            icon={<FaCalendarCheck />}
            color="bg-green-200"
            to="/attendance"
            isActive={false}
          />
          <DashboardTile
            label="Resources"
            icon={<FaClipboardList />}
            color="bg-blue-300"
            to="/resources"
            isActive={false}
          />
          <DashboardTile
            label="Videos"
            icon={<FaVideo />}
            color="bg-purple-300"
            to="/videos"
            isActive={false}
          />
          <DashboardTile
            label="Lessons"
            icon={<FaChalkboardTeacher />}
            color="bg-pink-300"
            to="/lessons"
            isActive={true}
          />
          <DashboardTile
            label="Notices"
            icon={<FaBell />}
            color="bg-red-200"
            to="/notices"
            isActive={false}
          />
        </div>

        <div className=' flex-col mt-6 bg-white shadow-lg rounded-lg p-6'>
          <div className="mt-6">
            <h2 className="text-md font-semibold cursor-pointer mb-4 hover:bg-pink-500 hover:text-white rounded-lg w-60" data-aos="fade-left"><Link to='activities'>Recent Activities</Link></h2>
            {/* Add your recent activities component here */}
          </div>
          <div className="mt-6">
            <h2 className="text-md font-semibold cursor-pointer mb-4 hover:bg-pink-500 hover:text-white rounded-lg w-60" data-aos="fade-left" data-aos-delay="200"><Link to='notifications'>Notifications</Link></h2>
            {/* Add your notifications component here */}
          </div>
          <div className="mt-6">
            <h2 className="text-md font-semibold cursor-pointer mb-4 hover:bg-pink-500 hover:text-white-600 rounded-lg w-60 " data-aos="fade-left" data-aos-delay="400"><Link to='messages'>Messages</Link></h2>
            {/* Add your messages component here */}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeworkList.map((hw, index) => (
            <HomeworkTile
              key={index}
              title={hw.title}
              dueDate={hw.dueDate}
              status={hw.status}
            />
          ))}
        </div>

        <HomeworkList />

      </main>
    </>
  );
};

export default Dashboard;

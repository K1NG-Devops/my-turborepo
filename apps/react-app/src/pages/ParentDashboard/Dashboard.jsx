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
import EventsCalendar from '../../components/Calendar/EventsCalendar';
import axios from 'axios';

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
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [homeworkList, setHomeworkList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [homeworkProgress, setHomeworkProgress] = useState({
    total: 0,
    submitted: 0,
    percentage: 0
  });

  const parent_id = localStorage.getItem('parent_id');
  const token = localStorage.getItem('accessToken');

  // Fetch children for the dropdown
  const fetchChildren = async () => {
    if (!parent_id || !token) return;
    
    try {
      console.log('Fetching children for parent ID:', parent_id);
      const res = await axios.get(
        `https://youngeagles-api-server.up.railway.app/api/auth/parents/${parent_id}/children`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Children response:', res.data);
      const childrenData = Array.isArray(res.data) ? res.data : res.data.children || [];
      setChildren(childrenData);
      
      // Auto-select first child if no child is selected
      if (childrenData.length > 0 && !selectedChild) {
        setSelectedChild(childrenData[0].id.toString());
      }
    } catch (err) {
      console.error('Error fetching children:', err);
      setChildren([]);
    }
  };

// Fetch homework data for progress tracking
  const fetchHomeworkData = async () => {
    if (!parent_id || !token || !selectedChild) return;
    
    try {
      const res = await axios.get(
        `https://youngeagles-api-server.up.railway.app/api/homeworks/for-parent/${parent_id}?child_id=${selectedChild}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const hwList = Array.isArray(res.data) ? res.data : res.data.homeworks || [];
      setHomeworkList(hwList);
      
      // Calculate progress
      const total = hwList.length;
      const submitted = hwList.filter(hw => hw.submitted).length;
      const percentage = total > 0 ? (submitted / total) * 100 : 0;
      
      setHomeworkProgress({
        total,
        submitted,
        percentage
      });
    } catch (err) {
      console.error('Error fetching homework:', err);
    }
  };

  useEffect(() => {
    fetchChildren();
    fetchHomeworkData();
  }, [parent_id, token]);

  // Refresh homework data every 30 seconds to catch updates
  useEffect(() => {
    const interval = setInterval(fetchHomeworkData, 30000);
    return () => clearInterval(interval);
  }, [parent_id, token]);

  // Fetch real notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Replace with actual API call when notification system is implemented
        // For now, keep empty to avoid placeholder data
        setNotifications([]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };
    
    fetchNotifications();
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;


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
                <select
                  className="w-full p-2 border rounded bg-white text-black"
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                >
                  <option value="">Select a child</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} - {child.className || 'No Class'}
                    </option>
                  ))}
                </select>
                <li>
                  <Link
                    to="/submit-work"
                    className={`${linkStyles} ${location.pathname === '/submit-work' ? linkStyles2 : ''}`}
                  >
                    📤 Submit Work
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

      <main className="sm:ml-64 min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
            <div className="flex items-center space-x-3">
              <Link
                to="/home"
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardTile
              label="Homework"
              icon={<FaBook />}
              color="bg-blue-100 hover:bg-blue-200"
              to={`/student/homework?className=${encodeURIComponent(className)}&grade=${encodeURIComponent(grade)}`}
              isActive={true}
            />
            <DashboardTile
              label="Submit Work"
              icon={<FaClipboardList />}
              color="bg-green-100 hover:bg-green-200"
              to="/submit-work"
              isActive={true}
            />
            <DashboardTile
              label="Notifications"
              icon={
                <div className="relative">
                  <FaBell />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
              }
              color="bg-red-100 hover:bg-red-200"
              to="/notifications"
              isActive={true}
            />
          </div>

          {/* Progress Overview */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Homework Progress</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-800">
                  {homeworkProgress.submitted}/{homeworkProgress.total} 
                  ({Math.round(homeworkProgress.percentage)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500" 
                  style={{width: `${homeworkProgress.percentage}%`}}
                ></div>
              </div>
              {homeworkProgress.total === 0 && (
                <p className="text-sm text-yellow-600">No homework assigned yet</p>
              )}
            </div>
          </div>

          {/* Events Calendar */}
          <div>
            <EventsCalendar />
          </div>
          
          {/* Homework List Integration */}
          <div>
            <HomeworkList onProgressUpdate={fetchHomeworkData} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;

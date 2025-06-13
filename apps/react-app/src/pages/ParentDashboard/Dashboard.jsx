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
  }, [parent_id, token]);

  // Fetch homework data when selectedChild changes
  useEffect(() => {
    if (selectedChild) {
      fetchHomeworkData();
    }
  }, [selectedChild, parent_id, token]);

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
      {/* Hamburger menu (mobile only) - Moved to nav bar */}


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

      <main className="sm:ml-64 min-h-screen bg-gray-50 transition-all duration-300 ease-in-out overflow-x-hidden">
        {/* Sticky Top Navigation */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
          <div className="flex justify-between items-center p-4">
            {/* Mobile hamburger button */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="sm:hidden p-2 text-cyan-800 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">Parent Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <Link
                to="/home"
                className="hidden sm:inline-block text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 md:px-4 text-sm md:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-w-full overflow-x-hidden">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h2>
            <p className="text-cyan-100">Track your child's learning progress and stay connected with their education journey.</p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Children */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Children</p>
                  <p className="text-3xl font-bold text-gray-900">{children.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Homework Completion */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Homework Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{Math.round(homeworkProgress.percentage)}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaBook className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${homeworkProgress.percentage}%`}}
                  ></div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Notifications</p>
                  <p className="text-3xl font-bold text-gray-900">{unreadNotifications}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaBell className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              {unreadNotifications > 0 && (
                <p className="text-sm text-yellow-600 mt-2">You have new updates</p>
              )}
            </div>

            {/* Assignments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-3xl font-bold text-gray-900">{homeworkProgress.total}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaClipboardList className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{homeworkProgress.submitted} completed</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={`/student/homework?className=${encodeURIComponent(className)}&grade=${encodeURIComponent(grade)}`}
                className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200">
                  <FaBook className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Homework</p>
                  <p className="text-sm text-gray-600">Check assignments</p>
                </div>
              </Link>

              <Link
                to="/submit-work"
                className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200">
                  <FaClipboardList className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Submit Work</p>
                  <p className="text-sm text-gray-600">Upload assignments</p>
                </div>
              </Link>

              <Link
                to="/register-child"
                className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add Child</p>
                  <p className="text-sm text-gray-600">Register new child</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Child Progress Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Child Progress</h3>
              {children.length > 0 && (
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
              )}
            </div>
            
            {selectedChild ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Overall Progress</p>
                    <p className="text-sm text-gray-600">{homeworkProgress.submitted} of {homeworkProgress.total} assignments completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-600">{Math.round(homeworkProgress.percentage)}%</p>
                    <p className="text-sm text-gray-500">Completion rate</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Completed</p>
                        <p className="text-xl font-bold text-green-900">{homeworkProgress.submitted}</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-800">Pending</p>
                        <p className="text-xl font-bold text-orange-900">{homeworkProgress.total - homeworkProgress.submitted}</p>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-gray-600">Select a child to view their progress</p>
              </div>
            )}
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

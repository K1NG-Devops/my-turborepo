import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

const Dashboard = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/home'); // Redirect to homepage
  };

  return (
    <>
    <DashboardNavbar />
    <div className="flex bg-gray-700 min-h-screen">
      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
          <ul className="space-y-2 font-medium">
            <li>
              <Link to="/dashboard" className="flex items-center p-2 text-blue-600 rounded-lg hover:bg-gray-100 group">
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <span className="flex-1 ms-3 whitespace-nowrap">Report</span>
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <span className="flex-1 ms-3 whitespace-nowrap">Payment</span>
              </Link>
            </li>
            <li>
              <Link to="/home" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <span className="flex-1 ms-3 whitespace-nowrap">Back to Home</span>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-left flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="w-full p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          <div className="text-xl text-white font-semibold mb-4">Welcome, {user?.name || 'Parent'}!</div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 text-2xl text-gray-400">+</div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 text-2xl text-gray-400">+</div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 text-2xl text-gray-400">+</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 text-2xl text-gray-400">+</div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 text-2xl text-gray-400">+</div>
          </div>
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 text-2xl text-gray-400">+</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 text-2xl text-gray-400">+</div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 text-2xl text-gray-400">+</div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;

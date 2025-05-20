import React, { useState } from "react";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEnvelope,
  FaFileUpload,
  FaCamera,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";

const TeacherDashboard = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleProfileUpload = () => {
    alert("Profile picture upload functionality coming soon!");
  };

  const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";
  const userProfilePic =
    user?.profilePic && user.profilePic !== "null"
      ? user.profilePic
      : defaultAvatar;

  return (
    <div className="min-h-screen h-full flex flex-col md:flex-row bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-700 to-blue-900 text-white w-64 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 flex flex-col`}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center py-8 px-4 border-b border-blue-600">
          <img
            src={userProfilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow-lg"
          />
          <h2 className="text-xl font-semibold">{user?.name || "Teacher Name"}</h2>
          <p className="text-sm opacity-80">{user?.email || "teacher@example.com"}</p>

          <button
            onClick={handleProfileUpload}
            className="mt-4 flex items-center gap-2 text-sm px-4 py-2 bg-white text-blue-800 rounded hover:bg-blue-100 transition"
          >
            <FaUpload size={16} />
            Upload Photo
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-grow px-6 py-8 space-y-6 overflow-y-auto">
          {[
            ["Attendance", <FaChalkboardTeacher size={22} />],
            ["Calendar", <FaCalendarAlt size={22} />],
            ["Messages", <FaEnvelope size={22} />],
            ["Upload Reports", <FaFileUpload size={22} />],
            ["Child Photos", <FaCamera size={22} />],
          ].map(([label, icon]) => (
            <button
              key={label}
              className="flex items-center gap-4 text-lg hover:text-blue-300 transition-colors w-full"
              onClick={closeSidebar}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-6 py-4 border-t border-blue-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full justify-center bg-red-600 hover:bg-red-700 transition-colors rounded-md py-2"
          >
            <FaSignOutAlt size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-2 m-2 text-blue-700 bg-white rounded-md shadow-md focus:outline-none fixed top-2 left-2 z-50"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Main Content */}
      <main className="flex-grow p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
        {[
          {
            title: "Attendance",
            icon: <FaChalkboardTeacher size={48} className="text-blue-700" />,
            description: "View and manage student attendance",
            bgColor: "bg-blue-200",
          },
          {
            title: "Calendar",
            icon: <FaCalendarAlt size={48} className="text-purple-700" />,
            description: "Check upcoming events and holidays",
            bgColor: "bg-purple-200",
          },
          {
            title: "Messages",
            icon: <FaEnvelope size={48} className="text-pink-600" />,
            description: "View messages from parents and staff",
            bgColor: "bg-pink-200",
          },
          {
            title: "Upload Reports",
            icon: <FaFileUpload size={48} className="text-green-700" />,
            description: "Upload daily reports or PDFs",
            bgColor: "bg-green-200",
          },
          {
            title: "Child Photos",
            icon: <FaCamera size={48} className="text-yellow-700" />,
            description: "Upload and manage child photos",
            bgColor: "bg-yellow-200",
          },
        ].map(({ title, icon, description, bgColor }) => (
          <div
            key={title}
            className={`${bgColor} rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-shadow cursor-pointer min-h-[220px]`}
          >
            <div className="mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700 font-medium">{description}</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default TeacherDashboard;

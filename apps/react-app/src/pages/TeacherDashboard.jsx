import React, { useState } from "react";
import Sidebar from "../components/Teacher/Sidebar";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/Teacher/DashboardCard";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEnvelope,
  FaFileUpload,
  FaCamera,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";
import TeacherChildrenList from "../components/Teacher/TeacherChildrenList";

const TeacherDashboard = ({ user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [childrenList, setChildrenList] = useState([]);
  const [showChildren, setShowChildren] = useState(false);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileUpload = () => {
    alert("Profile picture upload coming soon!");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const fetchChildren = () => {
    // Simulate fetching children data
    const children = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alice Johnson" },
    ];
    setChildrenList(children);
    setShowChildren(true);
  };

  const cards = [
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
    {
      title: "My Children",
      icon: <FaChalkboardTeacher size={48} className="text-teal-700" />,
      description: "View and manage your assigned children",
      bgColor: "bg-teal-200",
      onClick: fetchChildren,
    },
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"}`}>

      {/* Sidebar (drawer on mobile) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:block`}
      >
        <Sidebar
          user={user}
          onLogout={handleLogout}
          onUploadPhoto={handleProfileUpload}
        />
      </aside>

      {/* Hamburger Menu Button */}
      <button
        className="md:hidden fixed top-2 left-2 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <FaBars />
      </button>

      {/* Dark Mode Toggle */}
      <button
        className="p-2 text-yellow-500 bg-gray-800 rounded-md shadow-md fixed top-2 right-2 z-50"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto p-8 mt-12 md:mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {showChildren ? (
            <TeacherChildrenList onBack={() => setShowChildren(false)} />
          ) : (
            cards.map((card) => <DashboardCard key={card.title} {...card} />)
          )}


        </div>
      </main>
    </div>
  );

}

export default TeacherDashboard;

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Teacher/Sidebar";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/Teacher/DashboardCard";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEnvelope,
  FaFileUpload,
  FaBars,
  FaTimes,
  FaBook,
} from "react-icons/fa";
import TeacherChildrenList from "../../components/Teacher/TeacherChildrenList";
import TeacherAttendance from "../../components/Teacher/TeacherAttendance";
import axios from "axios";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TeacherDashboard = ({ user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [childrenList, setChildrenList] = useState([]);
  const [showChildren, setShowChildren] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [homeworks, setHomeworks] = useState([]);
  const [showHomeworks, setShowHomeworks] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', instructions: '', due_date: '' });
  const navigate = useNavigate();

  const sidebarRef = useRef();

  // Handle click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("teacherId");
    navigate("/login");
  };

  const handleProfileUpload = () => {
    alert("Profile picture upload coming soon!");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const fetchChildren = () => {
    const children = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Alice Johnson" },
    ];
    setChildrenList(children);
    setShowChildren(true);
  };

  const fetchHomeworks = async () => {
    try {
      const teacherId = localStorage.getItem('teacherId');
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(
        `https://youngeagles-api-server.up.railway.app/api/homeworks/for-teacher/${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHomeworks(res.data.homeworks || []);
      setShowHomeworks(true);
    } catch (err) {
      alert('Failed to load homeworks');
    }
  };

  // Modern, professional card color map
  const tileColors = [
    '#e3eafc', // Attendance - soft blue
    '#e0e7ff', // Calendar - soft indigo
    '#f1f5f9', // Messages - soft gray
    '#e0f2fe', // Upload Reports - light blue
    '#fef9c3', // Post Homework - soft yellow
    '#f3e8ff', // My Children - light purple
    '#ffe4e6', // My Homeworks - light pink
  ];

  // MUI theme for light/dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2563eb',
      },
      secondary: {
        main: '#f472b6',
      },
      background: {
        default: darkMode ? '#18181b' : '#f8fafc',
        paper: darkMode ? '#23232a' : '#fff',
      },
    },
  });

  const cards = [
    {
      title: "Attendance",
      icon: <FaChalkboardTeacher size={48} className="text-blue-700" />,
      description: "View and manage student attendance",
      bgColor: "bg-blue-200",
      onClick: () => setShowAttendance(true),
    },    
    {
      title: "Calendar",
      icon: <FaCalendarAlt size={48} className="text-purple-700" />,
      description: "Check upcoming events and holidays",
      bgColor: "bg-purple-200",
    },
    {
      title: "Year Planner",
      icon: <FaCalendarAlt size={48} className="text-indigo-700" />,
      description: "View the full year planner calendar",
      bgColor: "bg-indigo-200",
      onClick: () => navigate('/year-planner'),
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
      title: "Post Homework",
      icon: <FaFileUpload size={48} className="text-orange-700" />,
      description: "Post homework assignments for students",
      bgColor: "bg-orange-200",
      onClick: () => navigate("/homework/upload"),
    },
    {
      title: "My Children",
      icon: <FaChalkboardTeacher size={48} className="text-teal-700" />,
      description: "View and manage your assigned children",
      bgColor: "bg-teal-200",
      onClick: fetchChildren,
    },
    {
      title: "My Homeworks",
      icon: <FaBook size={48} className="text-orange-700" />,
      description: "View and manage your posted homeworks",
      bgColor: "bg-orange-100",
      onClick: fetchHomeworks,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-screen z-40 transform transition-transform duration-300 ease-in-out ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:block`}
          style={{ width: 250, background: 'none' }}
        >
          <Sidebar
            user={user}
            onLogout={handleLogout}
            onUploadPhoto={handleProfileUpload}
            onSubmitEvent={() => navigate('/teacher/events/upload')}
          />
        </aside>

        {/* Overlay on mobile when sidebar is open */}
        {showSidebar && (
          <div
            className="fixed inset-0  bg-opacity-10 z-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Hamburger / X Button */}
        <button
          className="sidebar-toggle md:hidden fixed top-2 left-2 z-50 p-2 bg-gray-800 text-white rounded-md"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* App Bar */}
        <AppBar position="fixed" color="primary" elevation={4} sx={{
          left: 250,
          width: 'calc(100% - 250px)',
          height: 48,
          background: 'rgba(24,24,27,0.95)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(8px)',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Toolbar sx={{ minHeight: 48, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Search Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(36,36,40,0.7)', borderRadius: 2, px: 2, py: 0.5, minWidth: 200 }}>
              <SearchIcon sx={{ color: '#a3e635', mr: 1 }} />
              <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: 120 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit">
                <NotificationsNoneIcon sx={{ color: '#a3e635' }} />
              </IconButton>
              <Avatar src={user?.profilePic} sx={{ width: 32, height: 32, border: '2px solid #a3e635' }} />
              <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <IconButton sx={{ ml: 1 }} onClick={handleLogout} color="inherit">
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <main className="flex-1 md:ml-0 overflow-y-auto" style={{ background: theme.palette.background.default, marginLeft: 20, marginTop: 45, paddingTop: 32, paddingRight: 32, paddingBottom: 32, paddingLeft: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            width: '100%',
            margin: 0,
            padding: 0,
          }}>
            {showChildren ? (
              <TeacherChildrenList onBack={() => setShowChildren(false)} />
            ) : showAttendance ? (
              <TeacherAttendance onBack={() => setShowAttendance(false)} />
            ) : showHomeworks ? (
              <div>
                <button onClick={() => setShowHomeworks(false)} className="mb-4 px-4 py-2 bg-gray-300 rounded">Back</button>
                <h2 className="text-xl font-bold mb-4">My Posted Homeworks</h2>
                <ul>
                  {homeworks.map(hw => (
                    <li key={hw.id} className="mb-2 p-2 border rounded">
                      <div>
                        <strong>{hw.title}</strong> (Due: {new Date(hw.due_date).toLocaleDateString()})
                      </div>
                      <div>Class: {hw.className} | Grade: {hw.grade}</div>
                      <div>
                        <button
                          className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                          onClick={() => {
                            setEditingHomework(hw);
                            setEditForm({
                              title: hw.title,
                              instructions: hw.instructions,
                              due_date: hw.due_date ? hw.due_date.split('T')[0] : '', // format for input type="date"
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={async () => {
                            if (!window.confirm('Are you sure you want to delete this homework?')) return;
                            try {
                              const token = localStorage.getItem('accessToken');
                              await axios.delete(
                                `https://youngeagles-api-server.up.railway.app/api/homeworks/${hw.id}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              setHomeworks(homeworks.filter(h => h.id !== hw.id));
                              alert('Homework deleted!');
                            } catch (err) {
                              alert('Failed to delete homework');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {editingHomework && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                      <h2 className="text-lg font-bold mb-4">Edit Homework</h2>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            const token = localStorage.getItem('accessToken');
                            await axios.put(
                              `https://youngeagles-api-server.up.railway.app/api/homeworks/${editingHomework.id}`,
                              editForm,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            setHomeworks(homeworks.map(hw =>
                              hw.id === editingHomework.id
                                ? { ...hw, ...editForm }
                                : hw
                            ));
                            setEditingHomework(null);
                            alert('Homework updated!');
                          } catch (err) {
                            alert('Failed to update homework');
                          }
                        }}
                      >
                        <div className="mb-2">
                          <label className="block font-semibold">Title</label>
                          <input
                            className="w-full border p-2 rounded"
                            type="text"
                            value={editForm.title}
                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block font-semibold">Instructions</label>
                          <textarea
                            className="w-full border p-2 rounded"
                            value={editForm.instructions || ""}
                            onChange={e => setEditForm({ ...editForm, instructions: e.target.value })}
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block font-semibold">Due Date</label>
                          <input
                            className="w-full border p-2 rounded"
                            type="date"
                            value={editForm.due_date}
                            onChange={e => setEditForm({ ...editForm, due_date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setEditingHomework(null)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : ([
              ...cards.map((card, idx) => (
                <Card key={card.title} sx={{ background: tileColors[idx % tileColors.length], borderRadius: 4, boxShadow: 6, minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                  <CardActionArea onClick={card.onClick} sx={{ height: '100%' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                      {card.icon}
                      <Typography variant="h6" sx={{ mt: 2, fontSize: 22 }}>{card.title}</Typography>
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontSize: 16 }}>{card.description}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )),
              // Mini Calendar Tile
              <Card key="MiniCalendar" sx={{ background: '#23232a', borderRadius: 4, boxShadow: 6, minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, width: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#a3e635' }}>Mini Calendar</Typography>
                  <Box sx={{ width: '100%', maxWidth: 320 }}>
                    <Calendar />
                  </Box>
                </CardContent>
              </Card>
            ])}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default TeacherDashboard;

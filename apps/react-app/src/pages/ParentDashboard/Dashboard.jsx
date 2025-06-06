// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardTile from '../../components/DashboardTile';
import useAuth from '../../hooks/useAuth';
import { FaBook, FaCalendarCheck, FaClipboardList, FaVideo, FaChalkboardTeacher, FaBell, FaUserPlus } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeworkList from '../../pages/HomeworkList';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Popover from '@mui/material/Popover';
// MUI imports
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
  const [events, setEvents] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('https://youngeagles-api-server.up.railway.app/api/auth/parent/children', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChildren(res.data.children || []);
      } catch (err) {
        toast.error('Failed to load children.');
      }
    };
    fetchChildren();
  }, []);

  useEffect(() => {
    // Fetch approved events
    const fetchEvents = async () => {
      try {
        const res = await axios.get('https://youngeagles-api-server.up.railway.app/api/events?status=approved');
        setEvents(res.data.events || []);
      } catch (err) {
        // Optionally show error
      }
    };
    fetchEvents();
  }, []);

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

  // Sidebar navigation items
  const navItems = [
    { label: 'Dashboard', icon: <FaBook />, to: '/dashboard' },
    { label: 'Resources', icon: <FaClipboardList />, to: '/resources' },
    { label: 'Videos', icon: <FaVideo />, to: '/videos' },
    { label: 'Lessons', icon: <FaChalkboardTeacher />, to: '/lessons' },
    { label: 'Notices', icon: <FaBell />, to: '/notices' },
    { label: 'Register Child', icon: <FaUserPlus />, to: '/register-child' },
  ];

  // Dashboard tile color map
  const tileColors = [
    '#fef08a', // Homework - yellow
    '#bae6fd', // Resources - blue
    '#ddd6fe', // Videos - purple
    '#fbcfe8', // Lessons - pink
    '#fecaca', // Notices - red
    '#e0e7ff', // Year Planner - indigo
  ];

  // Helper: get all event dates as strings (YYYY-MM-DD)
  const eventDates = events.map(ev => new Date(ev.startDate).toISOString().split('T')[0]);

  // Calendar tileClassName for highlighting
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (eventDates.includes(dateStr)) {
        return 'event-day-highlight';
      }
    }
    return null;
  };

  // On calendar day click
  const handleCalendarClick = (date, event) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(ev => new Date(ev.startDate).toISOString().split('T')[0] === dateStr);
    setSelectedDateEvents(dayEvents);
    setCalendarValue(date);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedDateEvents([]);
  };

  const openPopover = Boolean(anchorEl);

  return (
    <>
      {/* Hamburger menu (mobile only) */}
      <Button
        onClick={toggleSidebar}
        sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300, display: { sm: 'none', xs: 'block' }, minWidth: 0, p: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}
      >
        {isSidebarOpen ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" clipRule="evenodd" d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z" />
          </svg>
        )}
      </Button>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? isSidebarOpen : true}
        onClose={closeSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderRight: '1px solid #e0e0e0',
            display: { xs: isMobile ? 'block' : 'none', sm: 'block' },
            overflowY: 'auto',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={userProfilePic} sx={{ width: 80, height: 80, mb: 1 }} />
          <Box sx={{ fontWeight: 600, fontSize: 18 }}>{userName}</Box>
          <Button variant="outlined" size="small" sx={{ mt: 1, mb: 2 }} onClick={toggleDropdown}>
            ▼ Options
          </Button>
          {isDropdownOpen && (
            <Paper sx={{ position: 'absolute', top: 120, left: 20, zIndex: 2000, width: 180 }}>
              <Button fullWidth onClick={() => navigate('/profile')}>Profile</Button>
              <Button fullWidth onClick={() => navigate('/settings')}>Settings</Button>
              <Button fullWidth color="error" onClick={handleLogout}>Logout</Button>
            </Paper>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          {navItems.map(({ label, icon, to }) => (
            <ListItem button key={label} onClick={() => navigate(to)} selected={location.pathname === to}>
              <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ fontWeight: 600, fontSize: 16, borderRadius: 2, boxShadow: 2 }}
            onClick={() => navigate('/popupload')}
          >
            Upload POP
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ px: 2, pb: 2 }}>
          <Paper elevation={2} sx={{ p: 1, borderRadius: 2 }}>
            <Calendar
              value={calendarValue}
              onClickDay={handleCalendarClick}
              tileClassName={tileClassName}
            />
            <Popover
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Box sx={{ p: 2, minWidth: 220 }}>
                {selectedDateEvents.length > 0 ? (
                  <>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Events on {calendarValue.toLocaleDateString()}:</Typography>
                    {selectedDateEvents.map(ev => (
                      <Box key={ev.id} sx={{ mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{ev.title}</Typography>
                        <Typography variant="body2">{ev.description}</Typography>
                        {ev.location && <Typography variant="caption">Location: {ev.location}</Typography>}
                      </Box>
                    ))}
                  </>
                ) : (
                  <Typography variant="body2">No events for this day.</Typography>
                )}
              </Box>
            </Popover>
          </Paper>
        </Box>
      </Drawer>

      <main className="sm:ml-64 p-4 min-h-screen bg-gray-300 transition-all duration-300 ease-in-out flex flex-col">
        {/* Top App Bar */}
        <AppBar position="static" color="primary" sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Button color="inherit" onClick={() => navigate('/home')} sx={{ mr: 2 }}>
              Home
            </Button>
            <Button color="error" variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Child selection dropdown moved here */}
        <div className="mb-4">
          <label htmlFor="child-select" className="block mb-2 font-semibold">Select a child:</label>
          <select
            id="child-select"
            className="w-full p-2 border rounded bg-white text-black"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            <option value="">Select a child</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} ({child.className}, {child.grade})
              </option>
            ))}
          </select>
        </div>
        {/* Dashboard tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Homework', icon: <FaBook size={32} />, color: tileColors[0], onClick: () => navigate(`/student/homework?className=${encodeURIComponent(className)}&grade=${encodeURIComponent(grade)}`) },
            { label: 'Resources', icon: <FaClipboardList size={32} />, color: tileColors[1], onClick: () => navigate('/resources') },
            { label: 'Videos', icon: <FaVideo size={32} />, color: tileColors[2], onClick: () => navigate('/videos') },
            { label: 'Lessons', icon: <FaChalkboardTeacher size={32} />, color: tileColors[3], onClick: () => navigate('/lessons') },
            { label: 'Notices', icon: <FaBell size={32} />, color: tileColors[4], onClick: () => navigate('/notices') },
            { label: 'Year Planner', icon: <FaCalendarCheck size={32} />, color: tileColors[5], onClick: () => navigate('/year-planner') },
          ].map((tile, idx) => (
            <Card key={tile.label} sx={{ background: tile.color, borderRadius: 3, boxShadow: 3 }}>
              <CardActionArea onClick={tile.onClick}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  {tile.icon}
                  <Typography variant="h6" sx={{ mt: 2 }}>{tile.label}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
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

        <HomeworkList selectedChildId={selectedChild} />

      </main>
    </>
  );
};

export default Dashboard;

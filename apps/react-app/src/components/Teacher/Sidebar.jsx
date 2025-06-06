import React from "react";
import { Link, useLocation } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FaChalkboardTeacher, FaCalendarAlt, FaEnvelope, FaFileUpload, FaCamera, FaSignOutAlt, FaUpload, FaBook, FaUserCircle } from "react-icons/fa";

const navItems = [
  { label: "Dashboard", icon: <FaChalkboardTeacher size={22} />, to: "/teacher-dashboard" },
  { label: "Calendar", icon: <FaCalendarAlt size={22} />, to: "/year-planner" },
  { label: "Messages", icon: <FaEnvelope size={22} />, to: "/messages" },
  { label: "Upload Reports", icon: <FaFileUpload size={22} />, to: "/upload-reports" },
  { label: "My Homeworks", icon: <FaBook size={22} />, to: "/my-homeworks" },
  { label: "Child Photos", icon: <FaCamera size={22} />, to: "/child-photos" },
];

const Sidebar = ({ user = {}, onLogout, onUploadPhoto, onSubmitEvent }) => {
  const location = useLocation();
  const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";
  const profilePic = user?.profilePic && user.profilePic !== "null" ? user.profilePic : defaultAvatar;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 250,
          height: '100vh',
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #18181b 80%, #6366f1 100%)',
          color: '#fff',
          borderTopRightRadius: 32,
          borderBottomRightRadius: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          py: 2,
        },
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        {/* Logo/Title */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, color: '#a3e635' }}>
            YE
          </Typography>
        </Box>
        {/* Profile Pic */}
        <Avatar src={profilePic} sx={{ width: 64, height: 64, mb: 2, border: '3px solid #a3e635', boxShadow: 2 }} />
        <Typography variant="subtitle2" sx={{ color: '#fff', mb: 2, fontWeight: 600, textAlign: 'center' }}>{user?.name || 'Teacher Name'}</Typography>
        {/* Submit New Event Button */}
        <Box sx={{ width: '90%', mb: 2 }}>
          <button
            onClick={onSubmitEvent}
            style={{
              width: '100%',
              background: '#a3e635',
              color: '#18181b',
              fontWeight: 700,
              border: 'none',
              borderRadius: 8,
              padding: '10px 0',
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(163,230,53,0.15)',
              marginBottom: 8,
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#bef264'}
            onMouseOut={e => e.currentTarget.style.background = '#a3e635'}
          >
            + Submit New Event
          </button>
        </Box>
        {/* Navigation */}
        <List sx={{ width: '100%', flexGrow: 1 }}>
          {navItems.map(({ label, icon, to }) => (
            <ListItem
              button
              key={label}
              component={Link}
              to={to}
              sx={{
                mb: 1,
                borderRadius: 2,
                background: location.pathname === to ? 'rgba(163, 230, 53, 0.15)' : 'none',
                color: location.pathname === to ? '#a3e635' : '#fff',
                '&:hover': {
                  background: 'rgba(163, 230, 53, 0.08)',
                  color: '#a3e635',
                },
                minHeight: 48,
                pl: 2,
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItem>
          ))}
        </List>
        {/* Logout at the bottom */}
        <Box sx={{ width: '100%', mt: 2 }}>
          <ListItem button onClick={onLogout} sx={{ color: '#fff', justifyContent: 'center', borderRadius: 2, '&:hover': { color: '#a3e635', background: 'rgba(163, 230, 53, 0.08)' } }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36, justifyContent: 'center' }}><FaSignOutAlt size={20} /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ display: { xs: 'none', md: 'block' } }} />
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

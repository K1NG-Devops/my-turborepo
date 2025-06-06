import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  background: 'linear-gradient(135deg, #1e293b 60%, #0ea5e9 100%)',
  color: '#fff',
  borderRight: 'none',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  width: 72,
  background: 'linear-gradient(135deg, #1e293b 60%, #0ea5e9 100%)',
  color: '#fff',
  borderRight: 'none',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'rgba(255,255,255,0.8)',
  color: '#1e293b',
  boxShadow: 'none',
  backdropFilter: 'blur(8px)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { label: 'Events', icon: <EventIcon />, path: '/admin/events' },
  { label: 'Children', icon: <ChildCareIcon />, path: '/admin/children' },
  { label: 'Parents', icon: <PeopleIcon />, path: '/admin/parents' },
  { label: 'Teachers', icon: <SchoolIcon />, path: '/admin/teachers' },
  { label: 'POP Submissions', icon: <AssignmentIcon />, path: '/admin/pop' },
  { label: 'Users', icon: <GroupIcon />, path: '/admin/users' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

export default function AdminDashboardLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current page title
  const currentNav = navItems.find(item => location.pathname.startsWith(item.path));
  const pageTitle = currentNav ? currentNav.label : 'Admin';

  const handleLogout = () => {
    // TODO: Add logout logic
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <Toolbar sx={{ justifyContent: open ? 'flex-start' : 'center', px: 2, minHeight: 64 }}>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: '#fff', fontWeight: 700, letterSpacing: 1, display: open ? 'block' : 'none' }}>
            Admin
          </Typography>
          <IconButton onClick={() => setOpen(!open)} sx={{ color: '#fff' }}>
            <span className="material-icons">{open ? 'chevron_left' : 'menu'}</span>
          </IconButton>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
              <NavLink to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 2,
                    my: 0.5,
                    '&.active': {
                      background: 'rgba(255,255,255,0.15)',
                    },
                  }}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: '#fff' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, borderRadius: 2, mb: 2 }} onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: '#fff' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="fixed" open={open} elevation={0} sx={{ left: open ? drawerWidth : 72, width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 72px)` }}>
          <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600, letterSpacing: 1 }}>{pageTitle}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Admin User">
                <Avatar sx={{ bgcolor: '#0ea5e9', color: '#fff' }}>A</Avatar>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar sx={{ minHeight: 64 }} />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, width: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
} 
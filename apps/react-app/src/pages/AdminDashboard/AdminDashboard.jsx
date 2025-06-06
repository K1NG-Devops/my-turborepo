import React from 'react';
import { Grid, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Avatar, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import EventIcon from '@mui/icons-material/Event';

const stats = [
  { label: 'Total Students', value: 320, icon: <ChildCareIcon fontSize="large" sx={{ color: '#0ea5e9' }} /> },
  { label: 'Total Parents', value: 210, icon: <PeopleIcon fontSize="large" sx={{ color: '#f59e42' }} /> },
  { label: 'Total Teachers', value: 25, icon: <SchoolIcon fontSize="large" sx={{ color: '#10b981' }} /> },
  { label: 'Pending Events', value: 4, icon: <EventIcon fontSize="large" sx={{ color: '#f43f5e' }} /> },
];

const recentActivity = [
  { id: 1, text: 'Event "Sports Day" submitted by Mr. Brown', time: '2 hours ago' },
  { id: 2, text: 'Parent Jane Doe registered child John Doe', time: '5 hours ago' },
  { id: 3, text: 'Teacher Ms. Green approved for Grade 2', time: '1 day ago' },
  { id: 4, text: 'POP submission reviewed for Bob Smith', time: '2 days ago' },
];

export default function AdminDashboard() {
  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 3 } }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Welcome to the Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, boxShadow: 2 }}>
              <Avatar sx={{ bgcolor: '#f1f5f9', width: 56, height: 56, mr: 2 }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{stat.value}</Typography>
                <Typography color="text.secondary">{stat.label}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 5 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
            <List>
              {recentActivity.map((item) => (
                <ListItem key={item.id} divider={item.id !== recentActivity.length}>
                  <ListItemText primary={item.text} secondary={item.time} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, TextField, Button, Switch, FormControlLabel, Stack, Typography, Divider } from '@mui/material';

export default function AdminSettings() {
  const [profile, setProfile] = useState({ name: 'Admin User', email: 'admin@school.com', password: '' });
  const [school, setSchool] = useState({ name: 'Young Eagles School', address: '123 Main St', session: '2023/2024' });
  const [notifications, setNotifications] = useState({ email: true, sms: false });

  return (
    <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h6">Settings</Typography>
      <Card>
        <CardHeader title="Profile Settings" />
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} fullWidth />
            <TextField label="Email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} fullWidth />
            <TextField label="Password" type="password" value={profile.password} onChange={e => setProfile(p => ({ ...p, password: e.target.value }))} fullWidth />
            <Button variant="contained">Save Profile</Button>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="School Settings" />
        <CardContent>
          <Stack spacing={2}>
            <TextField label="School Name" value={school.name} onChange={e => setSchool(s => ({ ...s, name: e.target.value }))} fullWidth />
            <TextField label="Address" value={school.address} onChange={e => setSchool(s => ({ ...s, address: e.target.value }))} fullWidth />
            <TextField label="Session" value={school.session} onChange={e => setSchool(s => ({ ...s, session: e.target.value }))} fullWidth />
            <Button variant="contained">Save School Settings</Button>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Notification Settings" />
        <CardContent>
          <FormControlLabel control={<Switch checked={notifications.email} onChange={e => setNotifications(n => ({ ...n, email: e.target.checked }))} />} label="Email Notifications" />
          <FormControlLabel control={<Switch checked={notifications.sms} onChange={e => setNotifications(n => ({ ...n, sms: e.target.checked }))} />} label="SMS Notifications" />
          <Button variant="contained">Save Notification Settings</Button>
        </CardContent>
      </Card>
    </Stack>
  );
} 
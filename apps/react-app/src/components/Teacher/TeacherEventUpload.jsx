import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const eventTypes = [
  'Holiday', 'Exam', 'Meeting', 'Workshop', 'Other'
];
const audiences = [
  'All', 'Parents', 'Teachers', 'Students'
];

const TeacherEventUpload = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: '',
    location: '',
    audience: '',
    attachments: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files : value,
    }));
  };

  // Upload files to Firebase and return array of {name, url}
  const uploadFilesToFirebase = async (files) => {
    const urls = [];
    for (let file of files) {
      const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push({ name: file.name, url });
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      let attachmentUrls = [];
      if (form.attachments && form.attachments.length > 0) {
        attachmentUrls = await uploadFilesToFirebase(Array.from(form.attachments));
      }

      const token = localStorage.getItem('accessToken');
      await axios.post('https://youngeagles-api-server.up.railway.app/api/events', {
        ...form,
        attachments: attachmentUrls,
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      setSuccess('Event submitted for approval!');
      setForm({ title: '', description: '', startDate: '', endDate: '', type: '', location: '', audience: '', attachments: null });
    } catch (err) {
      setError('Failed to submit event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Submit New Event</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} required fullWidth />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} fullWidth />
          <TextField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} required fullWidth />
          <TextField label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Type" name="type" value={form.type} onChange={handleChange} select required fullWidth>
            {eventTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
          </TextField>
          <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth />
          <TextField label="Audience" name="audience" value={form.audience} onChange={handleChange} select fullWidth>
            {audiences.map((aud) => <MenuItem key={aud} value={aud}>{aud}</MenuItem>)}
          </TextField>
          <Button variant="outlined" component="label">
            Upload Attachments
            <input type="file" name="attachments" multiple hidden onChange={e => setForm(f => ({ ...f, attachments: e.target.files }))} />
          </Button>
          {form.attachments && form.attachments.length > 0 && (
            <Typography variant="caption">{form.attachments.length} file(s) selected</Typography>
          )}
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Event'}
          </Button>
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </form>
    </Paper>
  );
};

export default TeacherEventUpload; 
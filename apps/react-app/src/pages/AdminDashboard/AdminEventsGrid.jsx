import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';

const AdminEventsGrid = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://youngeagles-api-server.up.railway.app/api/events');
      setEvents(res.data.events || []);
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `https://youngeagles-api-server.up.railway.app/api/events/${id}/approve`,
        {},
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      setSuccess('Event approved!');
      fetchEvents();
    } catch (err) {
      setError('Failed to approve event.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `https://youngeagles-api-server.up.railway.app/api/events/${id}/reject`,
        {},
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      setSuccess('Event rejected.');
      fetchEvents();
    } catch (err) {
      setError('Failed to reject event.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `https://youngeagles-api-server.up.railway.app/api/events/${selectedEvent.id}`,
        editForm,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      setSuccess('Event updated!');
      setEditDialogOpen(false);
      fetchEvents();
    } catch (err) {
      setError('Failed to update event.');
    }
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 140, valueGetter: ({ value }) => value ? new Date(value).toLocaleDateString() : '' },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => (
      <Chip label={params.value} color={params.value === 'approved' ? 'success' : params.value === 'pending' ? 'warning' : 'error'} size="small" />
    ) },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => { setSelectedEvent(params.row); setDialogOpen(true); }}>Details</Button>
          {params.row.status === 'pending' && (
            <>
              <Button size="small" variant="contained" color="success" disabled={actionLoading} onClick={() => handleApprove(params.row.id)}>Approve</Button>
              <Button size="small" variant="contained" color="error" disabled={actionLoading} onClick={() => handleReject(params.row.id)}>Reject</Button>
            </>
          )}
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedEvent(params.row);
              setEditForm(params.row);
              setEditDialogOpen(true);
            }}
          >
            Edit
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', height: 600 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Event Management</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">{success}</Typography>}
      <DataGrid
        rows={events}
        columns={columns}
        getRowId={row => row.id}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
        sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }}
      />
      {/* Event Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
            <Stack spacing={2}>
              <Typography><b>Title:</b> {selectedEvent.title}</Typography>
              <Typography><b>Description:</b> {selectedEvent.description}</Typography>
              <Typography><b>Type:</b> {selectedEvent.type}</Typography>
              <Typography><b>Status:</b> {selectedEvent.status}</Typography>
              <Typography><b>Start:</b> {new Date(selectedEvent.startDate).toLocaleString()}</Typography>
              {selectedEvent.endDate && <Typography><b>End:</b> {new Date(selectedEvent.endDate).toLocaleString()}</Typography>}
              {selectedEvent.location && <Typography><b>Location:</b> {selectedEvent.location}</Typography>}
              {selectedEvent.audience && <Typography><b>Audience:</b> {selectedEvent.audience}</Typography>}
              {selectedEvent.attachments && Array.isArray(selectedEvent.attachments) && selectedEvent.attachments.length > 0 && (
                <div>
                  <Typography><b>Attachments:</b></Typography>
                  <ul>
                    {selectedEvent.attachments.map((file, idx) => (
                      <li key={idx}>
                        <a href={file.url || file} target="_blank" rel="noopener noreferrer">{file.name || file}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={editForm.title || ''}
            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={editForm.description || ''}
            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Type"
            value={editForm.type || ''}
            onChange={e => setEditForm({ ...editForm, type: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={editForm.startDate ? editForm.startDate.split('T')[0] : ''}
            onChange={e => setEditForm({ ...editForm, startDate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={editForm.endDate ? editForm.endDate.split('T')[0] : ''}
            onChange={e => setEditForm({ ...editForm, endDate: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Location"
            value={editForm.location || ''}
            onChange={e => setEditForm({ ...editForm, location: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Audience"
            value={editForm.audience || ''}
            onChange={e => setEditForm({ ...editForm, audience: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminEventsGrid; 
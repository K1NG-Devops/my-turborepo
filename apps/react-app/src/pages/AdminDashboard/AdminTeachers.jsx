import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const mockTeachers = [
  { id: 1, name: 'Mr. Brown', email: 'brown@example.com', phone: '111-222-3333', subject: 'Math', status: 'Active' },
  { id: 2, name: 'Ms. Green', email: 'green@example.com', phone: '444-555-6666', subject: 'English', status: 'Active' },
  { id: 3, name: 'Mrs. White', email: 'white@example.com', phone: '777-888-9999', subject: 'Science', status: 'Inactive' },
];

export default function AdminTeachers() {
  const [rows, setRows] = useState(mockTeachers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', status: 'Active' });

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'subject', headerName: 'Subject', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'actions', headerName: 'Actions', width: 120, renderCell: () => <Button size="small">Edit</Button> },
  ];

  const handleAdd = () => {
    setRows([...rows, { ...form, id: rows.length + 1 }]);
    setOpen(false);
    setForm({ name: '', email: '', phone: '', subject: '', status: 'Active' });
  };

  return (
    <div style={{ width: '100%', height: 500 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Teachers Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Teacher</Button>
      </Stack>
      <DataGrid rows={rows} columns={columns} autoHeight disableRowSelectionOnClick sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Teacher</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth />
            <TextField label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} fullWidth />
            <TextField label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} fullWidth />
            <TextField label="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 
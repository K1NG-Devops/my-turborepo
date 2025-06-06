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

const mockParents = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', phone: '123-456-7890', children: 'John Doe', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '555-123-4567', children: 'Alice Smith', status: 'Active' },
  { id: 3, name: 'Sara Lee', email: 'sara@example.com', phone: '987-654-3210', children: 'Sam Lee', status: 'Inactive' },
];

export default function AdminParents() {
  const [rows, setRows] = useState(mockParents);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', children: '', status: 'Active' });

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'children', headerName: 'Children', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'actions', headerName: 'Actions', width: 120, renderCell: () => <Button size="small">Edit</Button> },
  ];

  const handleAdd = () => {
    setRows([...rows, { ...form, id: rows.length + 1 }]);
    setOpen(false);
    setForm({ name: '', email: '', phone: '', children: '', status: 'Active' });
  };

  return (
    <div style={{ width: '100%', height: 500 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Parents Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Parent</Button>
      </Stack>
      <DataGrid rows={rows} columns={columns} autoHeight disableRowSelectionOnClick sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Parent</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth />
            <TextField label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} fullWidth />
            <TextField label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} fullWidth />
            <TextField label="Children" value={form.children} onChange={e => setForm(f => ({ ...f, children: e.target.value }))} fullWidth />
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
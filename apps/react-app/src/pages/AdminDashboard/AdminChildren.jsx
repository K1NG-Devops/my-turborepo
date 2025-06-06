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

const mockChildren = [
  { id: 1, name: 'John Doe', class: 'Grade 1', age: 6, parent: 'Jane Doe', status: 'Active' },
  { id: 2, name: 'Alice Smith', class: 'Grade 2', age: 7, parent: 'Bob Smith', status: 'Active' },
  { id: 3, name: 'Sam Lee', class: 'Grade 1', age: 6, parent: 'Sara Lee', status: 'Inactive' },
];

export default function AdminChildren() {
  const [rows, setRows] = useState(mockChildren);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', class: '', age: '', parent: '', status: 'Active' });

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'class', headerName: 'Class', width: 120 },
    { field: 'age', headerName: 'Age', width: 80 },
    { field: 'parent', headerName: 'Parent', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'actions', headerName: 'Actions', width: 120, renderCell: () => <Button size="small">Edit</Button> },
  ];

  const handleAdd = () => {
    setRows([...rows, { ...form, id: rows.length + 1 }]);
    setOpen(false);
    setForm({ name: '', class: '', age: '', parent: '', status: 'Active' });
  };

  return (
    <div style={{ width: '100%', height: 500 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Children Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Child</Button>
      </Stack>
      <DataGrid rows={rows} columns={columns} autoHeight disableRowSelectionOnClick sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Child</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth />
            <TextField label="Class" value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} fullWidth />
            <TextField label="Age" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} fullWidth />
            <TextField label="Parent" value={form.parent} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} fullWidth />
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
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const mockSubmissions = [
  { id: 1, parent: 'Jane Doe', amount: 500, date: '2024-06-01', status: 'Pending' },
  { id: 2, parent: 'Bob Smith', amount: 700, date: '2024-06-02', status: 'Approved' },
  { id: 3, parent: 'Sara Lee', amount: 600, date: '2024-06-03', status: 'Rejected' },
];

export default function AdminPopSubmissions() {
  const [rows, setRows] = useState(mockSubmissions);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const columns = [
    { field: 'parent', headerName: 'Parent', flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'date', headerName: 'Date', width: 140 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'actions', headerName: 'Actions', width: 120, renderCell: (params) => (
      <Button size="small" onClick={() => { setSelected(params.row); setOpen(true); }}>Review</Button>
    ) },
  ];

  const handleApprove = () => {
    setRows(rows.map(r => r.id === selected.id ? { ...r, status: 'Approved' } : r));
    setOpen(false);
  };
  const handleReject = () => {
    setRows(rows.map(r => r.id === selected.id ? { ...r, status: 'Rejected' } : r));
    setOpen(false);
  };

  return (
    <div style={{ width: '100%', height: 500 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">POP Submissions</Typography>
      </Stack>
      <DataGrid rows={rows} columns={columns} autoHeight disableRowSelectionOnClick sx={{ background: '#fff', borderRadius: 2, boxShadow: 2 }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Review POP Submission</DialogTitle>
        <DialogContent>
          {selected && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography><b>Parent:</b> {selected.parent}</Typography>
              <Typography><b>Amount:</b> ₦{selected.amount}</Typography>
              <Typography><b>Date:</b> {selected.date}</Typography>
              <Typography><b>Status:</b> {selected.status}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={handleApprove} variant="contained" color="success">Approve</Button>
          <Button onClick={handleReject} variant="contained" color="error">Reject</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 
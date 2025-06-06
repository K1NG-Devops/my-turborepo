import React, { useState, useEffect } from "react";
import axios from "axios";
import { decodeToken } from "../../utils/decodeToken";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TeacherAttendance = ({ onBack }) => {
  const [children, setChildren] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in");
      return;
    }
  
    const decoded = decodeToken(token);
    if (!decoded?.id) {
      console.warn("No teacher ID found in token");
      return;
    }
  
    setTeacherId(decoded.id);
  
    // ✅ Fetch children using the authenticated route
    axios.get("https://youngeagles-api-server.up.railway.app/api/children", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache",
      }
    })
    .then((res) => {
      console.log("API response:", res.data);
    
      const fetchedChildren = res.data.children || res.data;
      console.log("Fetched children:", fetchedChildren);
    
      if (!Array.isArray(fetchedChildren)) {
        throw new Error("Children list not returned properly.");
      }
    
      setChildren(fetchedChildren);
    
      const initialAttendance = {};
      fetchedChildren.forEach((child) => {
        initialAttendance[child.id] = { status: "none", late: false };
      });
      setAttendance(initialAttendance);
    })
    
      
      .catch((err) => {
        console.error("Error fetching children:", err.response?.data || err.message);
        alert("Could not load children list.");
      })
      .finally(() => setLoading(false));
  }, []);
  

  const markAttendance = (childId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        status,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!teacherId) {
      alert("Teacher ID missing.");
      return;
    }

    const records = [];
    for (const child of children) {
      const record = attendance[child.id];
      if (record?.status && record.status !== "none") {
        records.push({
          teacherId,
          childId: child.id,
          date,
          status: record.status.toLowerCase(),
          late: !!record.late,
        });
      }
    }

    if (records.length === 0) {
      alert("Please mark attendance for at least one child.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        "https://youngeagles-api-server.up.railway.app/api/attendance/mark-attendance",
        records,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Attendance submitted successfully.");
    } catch (error) {
      console.error("Error submitting attendance:", error.response?.data || error.message);
      alert("Failed to submit attendance. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-purple-700 dark:text-white">Loading children...</p>
      </div>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 1, color: '#6366f1' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#6366f1', fontWeight: 700 }}>Back</Typography>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 6, background: 'rgba(36,36,40,0.95)', color: '#fff' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#a3e635', fontWeight: 700 }}>Attendance Register</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#a3e635', fontWeight: 700 }}>Student Name</TableCell>
                <TableCell sx={{ color: '#a3e635', fontWeight: 700 }}>Present</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children.map((child) => (
                <TableRow key={child.id}>
                  <TableCell sx={{ color: '#fff' }}>{child.name}</TableCell>
                  <TableCell sx={{ color: attendance[child.id]?.status === 'Present' ? '#a3e635' : '#f87171', fontWeight: 600 }}>
                    {attendance[child.id]?.status === 'Present' ? 'Yes' : 'No'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TeacherAttendance;

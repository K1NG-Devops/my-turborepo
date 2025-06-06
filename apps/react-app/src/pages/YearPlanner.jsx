import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const typeColors = {
  Holiday: 'success',
  Exam: 'error',
  Meeting: 'info',
  Workshop: 'warning',
  Other: 'default',
};

const YearPlanner = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('https://youngeagles-api-server.up.railway.app/api/events?status=approved');
        const mapped = (res.data.events || []).map(ev => ({
          id: ev.id,
          title: ev.title,
          start: new Date(ev.startDate),
          end: ev.endDate ? new Date(ev.endDate) : new Date(ev.startDate),
          allDay: true,
          resource: ev,
        }));
        setEvents(mapped);
      } catch (err) {
        // Optionally show error
      }
    };
    fetchEvents();
  }, []);

  // Filtering
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const typeMatch = typeFilter ? (ev.resource.type === typeFilter) : true;
      const audienceMatch = audienceFilter ? (ev.resource.audience === audienceFilter) : true;
      return typeMatch && audienceMatch;
    });
  }, [events, typeFilter, audienceFilter]);

  // Custom toolbar
  function CustomToolbar({ label, onNavigate, onView, view }) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Year Planner</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" onClick={() => onNavigate('TODAY')}>Today</Button>
          <Button variant="outlined" size="small" onClick={() => onNavigate('PREV')}>{'<'}</Button>
          <Typography variant="subtitle1" sx={{ mx: 1 }}>{label}</Typography>
          <Button variant="outlined" size="small" onClick={() => onNavigate('NEXT')}>{'>'}</Button>
          <Select size="small" value={view} onChange={e => onView(e.target.value)} sx={{ ml: 2 }}>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="agenda">Agenda</MenuItem>
          </Select>
        </Stack>
      </Box>
    );
  }

  // Responsive calendar height
  const calendarHeight = window.innerWidth < 600 ? 400 : 600;

  return (
    <>
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 2, mb: 0, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1, color: '#6366f1' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#6366f1', fontWeight: 700 }}>Back</Typography>
      </Box>
      <Paper sx={{ maxWidth: 1200, mx: 'auto', mt: 1, p: { xs: 1, sm: 3 }, borderRadius: 4, boxShadow: 4, background: '#f8fafc' }}>
        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel>Type</InputLabel>
            <Select value={typeFilter} label="Type" onChange={e => setTypeFilter(e.target.value)}>
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Holiday">Holiday</MenuItem>
              <MenuItem value="Exam">Exam</MenuItem>
              <MenuItem value="Meeting">Meeting</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel>Audience</InputLabel>
            <Select value={audienceFilter} label="Audience" onChange={e => setAudienceFilter(e.target.value)}>
              <MenuItem value="">All Audiences</MenuItem>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Parents">Parents</MenuItem>
              <MenuItem value="Teachers">Teachers</MenuItem>
              <MenuItem value="Students">Students</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2, background: '#fff' }}>
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: calendarHeight, minWidth: 320 }}
            views={['month', 'week', 'day', 'agenda']}
            popup
            tooltipAccessor={event => event.resource?.description || event.title}
            eventPropGetter={event => ({ style: { backgroundColor: '#6366f1', color: '#fff', borderRadius: 6 } })}
            onSelectEvent={event => { setSelectedEvent(event.resource); setDialogOpen(true); }}
            components={{ toolbar: CustomToolbar }}
          />
        </Box>
        {/* Event Details Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedEvent?.title}
            {selectedEvent?.type && (
              <Chip label={selectedEvent.type} color={typeColors[selectedEvent.type] || 'default'} sx={{ ml: 2 }} />
            )}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              {selectedEvent?.description && <Typography>{selectedEvent.description}</Typography>}
              {selectedEvent?.location && <Typography><b>Location:</b> {selectedEvent.location}</Typography>}
              {selectedEvent?.audience && <Typography><b>Audience:</b> {selectedEvent.audience}</Typography>}
              {selectedEvent?.startDate && (
                <Typography><b>Start:</b> {new Date(selectedEvent.startDate).toLocaleString()}</Typography>
              )}
              {selectedEvent?.endDate && (
                <Typography><b>End:</b> {new Date(selectedEvent.endDate).toLocaleString()}</Typography>
              )}
              {selectedEvent?.attachments && Array.isArray(selectedEvent.attachments) && selectedEvent.attachments.length > 0 && (
                <Box>
                  <Typography><b>Attachments:</b></Typography>
                  <ul>
                    {selectedEvent.attachments.map((file, idx) => (
                      <li key={idx}>
                        <a href={file.url || file} target="_blank" rel="noopener noreferrer">{file.name || file}</a>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Stack>
          </DialogContent>
        </Dialog>
      </Paper>
    </>
  );
};

export default YearPlanner; 
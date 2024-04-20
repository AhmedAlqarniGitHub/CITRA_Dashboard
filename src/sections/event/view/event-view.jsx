import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import EventTableHead from '../event-table-head';
import EventTableRow from '../event-table-row';
import EventTableToolbar from '../event-table-toolbar';

import CircularProgress from '@mui/material/CircularProgress';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import { applyFilter, getComparator } from '../utils_event';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('eventName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [organizers, setOrganizers] = useState([]);


  const initialEventState = {
    organizer: '',
    eventName: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'active',
    cameras: [],
  };


  const [newEvent, setNewEvent] = useState(initialEventState);



  useEffect(() => {
    let user = {
      id: localStorage.getItem('id'),
    };
    axios
      .get(`${apiBaseUrl}/events/all/${user.id}`)
      .then((response) => {
        setEvents(response.data);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    fetchOrganizers();

  }, []);

  const refreshEventList = async () => {
    try {
      setLoading(true);
      let user = {
        id: localStorage.getItem('id'),
      };
      const response = await axios.get(`${apiBaseUrl}/events/all/${user.id}`);
      setEvents(response.data);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchAvailableCameras = async () => {
    try {
      const userId = localStorage.getItem('id'); // or however you store/retrieve the current user's ID
      const response = await axios.get(`${apiBaseUrl}/cameras/available/${userId}`);
      setAvailableCameras(response.data);
    } catch (error) {
      console.error('Error fetching available cameras:', error);
    }
  };

  const fetchOrganizers = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/users/all/${localStorage.getItem('id')}`);
      setOrganizers(response.data);
    } catch (error) {
      console.error('Error fetching organizers:', error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? events.map((n) => n._id) : []);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected =
      selectedIndex === -1 ? [...selected, id] : selected.filter((selectedId) => selectedId !== id);
    setSelected(newSelected);
  };

  const dataFiltered = applyFilter({
    inputData: events,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleClickOpen = () => {
    fetchAvailableCameras(); // Fetch cameras when dialog is opened
    setNewEvent(initialEventState); // Reset the form state

    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };

  const isDarkMode = localStorage.getItem('themeMode') === 'dark';



  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cameras") {
      // For a multi-select, the value is an array
      setNewEvent((prev) => ({
        ...prev,
        [name]: typeof value === 'string' ? value.split(',') : value,
      }));
    } else {
      setNewEvent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  const handleSubmit = async () => {
    try {
      const eventData = {
        name: newEvent.eventName,
        location: newEvent.location,
        startingDate: new Date(newEvent.startDate).toISOString(),
        endingDate: new Date(newEvent.endDate).toISOString(),
        description: newEvent.description,
        organizer: newEvent.organizer,
        status: newEvent.status,
        cameras: newEvent.cameras, // Include the selected cameras
      };

      const response = await axios.post(`${apiBaseUrl}/events/register`, eventData);
      handleClose();
      refreshEventList();
    } catch (error) {
      console.error('There was an error submitting the form', error);
    }
  };


  const emptyRows = rowsPerPage - Math.min(rowsPerPage, dataFiltered.length - page * rowsPerPage);

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Events</Typography>
          {window.localStorage.getItem("role") == 'admin' ?
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleClickOpen}
            >
              New Event
            </Button> : null
          }

        </Stack>

        <Card>
          <EventTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <EventTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={events.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'eventName', label: 'Event Name', align: 'left' },
                    { id: 'description', label: 'Description', align: 'left' },
                    { id: 'startDate', label: 'Start Date', align: 'left' },
                    { id: 'endDate', label: 'End Date', align: 'left' },
                    { id: 'location', label: 'Location', align: 'left' },
                    { id: 'status', label: 'Status', align: 'left' },
                  ]}
                />
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="subtitle1" color="error">
                          {error}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : dataFiltered.length > 0 ? (
                    dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <EventTableRow
                          key={row._id}
                          eventName={row.name}
                          organizer={row.organizer}
                          eventId={row._id}
                          description={row.description}
                          startDate={row.startingDate} // Format the starting date
                          endDate={row.endingDate} // Format the ending date
                          status={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                          location={row.location}
                          selected={selected.includes(row._id)}
                          handleClick={() => handleClick(row._id)}
                          refreshEventList={refreshEventList}
                        />
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <TableNoData query={filterName} />
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Dialog open={open} onClose={handleClose} sx={{
        '& .MuiDialog-paper': {
          boxShadow: isDarkMode ? 'none' : undefined,  // Conditionally apply boxShadow
        },
      }}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="eventName"
            label="Event Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newEvent.eventName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newEvent.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="datetime-local"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={newEvent.startDate}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="datetime-local"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            value={newEvent.endDate}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
            value={newEvent.location}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Organizer</InputLabel>
            <Select
              name="organizer"
              value={newEvent.organizer}
              onChange={handleChange}
              label="Organizer"
            >
              {organizers.map(org => (
                <MenuItem key={org._id} value={org._id}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Available Cameras</InputLabel>
            <Select
              multiple
              name="cameras"
              label="Available Cameras"
              value={newEvent.cameras}
              onChange={handleChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableCameras.map((camera) => (
                <MenuItem key={camera._id} value={camera._id}>
                  <Checkbox checked={newEvent.cameras.indexOf(camera._id) > -1} />
                  {`${camera.manufacturer} ${camera.model}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Status</FormLabel>
            <RadioGroup row name="status" value={newEvent.status} onChange={handleChange}>
              <FormControlLabel value="active" control={<Radio />} label="Active" />
              <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
            </RadioGroup>
          </FormControl>
          {/* Add more fields if necessary */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

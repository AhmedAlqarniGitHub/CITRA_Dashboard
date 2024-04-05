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
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import EventTableHead from '../event-table-head';
import EventTableRow from '../event-table-row';
import EventTableToolbar from '../event-table-toolbar';
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
  const [newEvent, setNewEvent] = useState({
    organizer: '660720849045c0664e4cb45e',//temp
    eventName: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'active',
  });


  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/events/all`)
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
  }, []);

  const refreshEventList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBaseUrl}/events/all`);
      setEvents(response.data);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'radio' ? e.target.getAttribute('value') : value;
    setNewEvent((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Sending `newEvent` to your server's 'events/register' endpoint 
      const eventData = {
        name: newEvent.eventName, // Make sure this is a string
        location: newEvent.location, // Make sure this is a string
        startingDate: new Date(newEvent.startDate).toISOString(), // Convert to ISO 8601
        endingDate: new Date(newEvent.endDate).toISOString(), // Convert to ISO 8601
        description: newEvent.description, // Make sure this is a string
        organizer: '5f50c31b892b3c6e2fae6e8b', // This should be the actual organizer ObjectId from your state/context
        status: newEvent.status, // This should be 'active' or 'inactive'
      };
      const response = await axios.post('http://localhost:3000/events/register', eventData);
      console.log(response.data);
      // If you need to do something with the response data, you can do it here
      handleClose(); // Close the dialog upon successful submission
      // Optionally, refresh the events list or display a success message
      refreshEventList(); // if you have a function to refresh the event list
      // showSnackbar('Event successfully created', 'success'); // if you have a notification system
    } catch (error) {
      // Handle the error accordingly, possibly showing an error message to the user
      console.error('There was an error submitting the form', error);
      // showSnackbar('Error submitting event', 'error'); // if you have a notification system
    }
  };



  const emptyRows = rowsPerPage - Math.min(rowsPerPage, dataFiltered.length - page * rowsPerPage);

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Events</Typography>
          <Button variant="contained" color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
            New Event
          </Button>

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
                    { id: 'eventId', label: 'Event ID', align: 'left' },
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
                    <tr>
                      <td colSpan={6}>Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6}>Error: {error}</td>
                    </tr>
                  ) : dataFiltered.length > 0 ? (
                    dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <EventTableRow
                          key={row._id}
                          eventName={row.name}
                          organizer={row.organizer}
                          eventId={row._id}
                          id={row._id}
                          description={row.description}
                          startDate={row.startingDate}
                          endDate={row.endingDate}
                          status={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                          location={row.location}
                          selected={selected.includes(row._id)}
                          handleClick={() => handleClick(row._id)}
                          refreshEventList={refreshEventList}
                        />
                      ))
                  ) : (
                    <TableNoData query={filterName} />
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
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
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Status</FormLabel>
            <RadioGroup
              row
              name="status"
              value={newEvent.status}
              onChange={handleChange}
            >
              <FormControlLabel
                value="active"
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value="inactive"
                control={<Radio />}
                label="Inactive"
              />
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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
  Checkbox,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CameraTableRow({
  id,
  selected,
  manufacturer,
  model,
  status,
  eventName,
  supportedQuality,
  framesPerSecond,
  handleClick,
  refreshCameraList,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCamera, setEditedCamera] = useState({
    manufacturer,
    model,
    supportedQuality,
    framesPerSecond,
    status,
    eventId: '', // Initialize with an empty string or the current event ID if available
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      fetchEvents();
    }
  }, [isEditMode]);

  const fetchEvents = async () => {
    try {
      const userId = localStorage.getItem('id');
      const response = await axios.get(`${apiBaseUrl}/events/all/${userId}`);
      setEvents(response.data); // Keep as is, assuming each event object has _id and name fields
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedCamera({
      manufacturer,
      model,
      supportedQuality,
      framesPerSecond,
      status,
      eventName,
    });
  };

  const handleChange = (prop) => (event) => {
    setEditedCamera({ ...editedCamera, [prop]: event.target.value });
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("id");
      const updatedCamera = { ...editedCamera, eventName: undefined }; // Remove eventName from the object to be sent
      await axios.patch(`${apiBaseUrl}/cameras/update/${id}/${userId}`, updatedCamera);
      setIsEditMode(false);
      refreshCameraList();
    } catch (error) {
      console.error('Error saving edited camera:', error);
    }
  };
  


  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiBaseUrl}/cameras/${id}`);
      setDeleteDialogOpen(false);
      refreshCameraList();
    } catch (error) {
      console.error('Error deleting camera:', error);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'in-use':
        return 'info';
      case 'maintenance':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={(event) => handleClick(event, id)} />
        </TableCell>
        {isEditMode ? (
          <>
            <TableCell>
            <Typography variant="subtitle2" noWrap>

              <TextField value={editedCamera.model} onChange={handleChange('model')} fullWidth />
              </Typography>

            </TableCell>
            <TableCell>
              <TextField value={editedCamera.manufacturer} onChange={handleChange('manufacturer')} fullWidth />
            </TableCell>
          
            <TableCell>
              <TextField value={editedCamera.supportedQuality} onChange={handleChange('supportedQuality')} fullWidth />
            </TableCell>
            <TableCell>
              <TextField type="number" value={editedCamera.framesPerSecond} onChange={handleChange('framesPerSecond')} fullWidth />
            </TableCell>
            <TableCell>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={editedCamera.status} label="Status" onChange={handleChange('status')}>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="in-use">In Use</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <FormControl fullWidth>
                <InputLabel>Event</InputLabel>
                <Select
                  value={editedCamera.eventId} // Use eventId for value
                  label="Event"
                  onChange={(e) => setEditedCamera({ ...editedCamera, eventId: e.target.value })} // Update eventId on change
                >
                  {events.map((event) => (
                    <MenuItem key={event._id} value={event._id}>{event.name}</MenuItem> // Use event._id as value
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell align="right">
              <IconButton onClick={handleSave}>
                <Iconify icon="eva:checkmark-fill" width={24} height={24} />
              </IconButton>
              <IconButton onClick={handleCancelEdit}>
                <Iconify icon="eva:close-fill" width={24} height={24} />
              </IconButton>
            </TableCell>
          </>
        ) : (
          <>
<TableCell>
  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
    {model}
  </Typography>
</TableCell>            <TableCell>{manufacturer}</TableCell>
          
            <TableCell>{supportedQuality}</TableCell>
            <TableCell>{framesPerSecond}</TableCell>
            <TableCell>
              <Label color={getStatusLabel(status)}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "No Status"}
              </Label>
            </TableCell>
            <TableCell>{eventName || 'No Event Assigned'}</TableCell>
            <TableCell align="right">
              <IconButton onClick={handleMenuOpen}>
                <Iconify icon="eva:more-vertical-fill" width={24} height={24} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>
                  <Iconify icon="eva:edit-fill" width={24} height={24} />
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                  <Iconify icon="eva:trash-2-outline" width={24} height={24} />
                  Delete
                </MenuItem>
              </Menu>
            </TableCell>
          </>
        )}
      </TableRow>
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this camera?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

CameraTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  manufacturer: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  eventName: PropTypes.string,
  supportedQuality: PropTypes.string.isRequired,
  framesPerSecond: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  refreshCameraList: PropTypes.func.isRequired,
};

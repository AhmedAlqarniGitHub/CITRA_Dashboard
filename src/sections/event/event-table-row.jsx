import React, { useState } from 'react';
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
  DialogContentText,
  DialogTitle,
  Button,
  Typography
} from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Adjust according to your needs
  return new Date(dateString).toLocaleDateString(undefined, options);
};
export default function EventTableRow({
  eventId,
  organizer,
  eventName,
  description,
  startDate,
  endDate,
  status,
  location,
  selected,
  handleClick,
  refreshEventList,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    eventName,
    description,
    startDate: startDate, // Adjusting date format for picker
    endDate: endDate, // Adjusting date format for picker
    location,
    organizer,
  });

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditedEvent({
      eventName,
      description,
      startDate: startDate.split('T')[0], // Adjusting date format for picker
      endDate: endDate.split('T')[0], // Adjusting date format for picker
      location,
      organizer,
    });
    setIsEditMode(true);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedEvent({
      eventName,
      description,
      startDate,
      endDate,
      location,
      organizer,
    });
  };

  const handleChange = (prop) => (event) => {
    setEditedEvent({ ...editedEvent, [prop]: event.target.value });
  };

  const handleSave = async () => {
    // Add 'organizer' to the editedEvent state if it needs to be editable
    const eventToUpdate = {
      name: editedEvent.eventName,
      description: editedEvent.description,
      startingDate: new Date(editedEvent.startDate).toISOString(),
      endingDate: new Date(editedEvent.endDate).toISOString(),
      location: editedEvent.location,
      organizer: editedEvent.organizer,
    };

    try {
      let user = {
        id: localStorage.getItem('id'),
      };
      const response = await axios.patch(
        `${apiBaseUrl}/events/update/${eventId}/${user.id}`,
        eventToUpdate
      );
      refreshEventList();
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving edited data:', error);
      // Show validation errors to the user
      if (error.response && error.response.data.errors) {
        error.response.data.errors.forEach((err) => {
          // Display these errors to the user
          console.error(err.message);
        });
      }
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      let user = {
        id: localStorage.getItem('id'),
      };
      const response = await axios.delete(`${apiBaseUrl}/events/${eventId}/${user.id}`);
      console.log('Delete response:', response.data);
      refreshEventList();
    } catch (error) {
      console.error('Error deleting event:', error);
      // Show error to the user if necessary
    }
    setDeleteDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <TableRow hover tabIndex={-1} selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={(event) => handleClick(event, id)} />
      </TableCell>

      {isEditMode ? (
        <>
          <TableCell>
            <TextField
              value={editedEvent.eventName}
              onChange={handleChange('eventName')}
              size="small"
              fullWidth
              variant="outlined"
            />
          </TableCell>
          <TableCell>
            <TextField
              value={editedEvent.description}
              onChange={handleChange('description')}
              size="small"
              fullWidth
              variant="outlined"
            />
          </TableCell>
          <TableCell>
            <TextField
              type="date"
              value={editedEvent.startDate}
              onChange={handleChange('startDate')}
              size="small"
              fullWidth
              variant="outlined"
            />
          </TableCell>
          <TableCell>
            <TextField
              type="date"
              value={editedEvent.endDate}
              onChange={handleChange('endDate')}
              size="small"
              fullWidth
              variant="outlined"
            />
          </TableCell>
          <TableCell>
            <TextField
              value={editedEvent.location}
              onChange={handleChange('location')}
              size="small"
              fullWidth
              variant="outlined"
            />
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
              {eventName}
            </Typography>
          </TableCell>          <TableCell>{description}</TableCell>
          <TableCell>{formatDate(startDate)}</TableCell>
          <TableCell>{formatDate(endDate)}</TableCell>
          <TableCell>{location}</TableCell>
        </>
      )}

      {/* Status is not editable */}
      <TableCell>
        <Label color={status === 'Active' ? 'success' : 'error'}>{status}</Label>
      </TableCell>

      {/* Action buttons */}
      <TableCell align="right">
        {isEditMode ? (
          <>
            <IconButton onClick={handleSave} color="primary">
              <Iconify icon="eva:checkmark-circle-2-outline" width="24" height="24" />
            </IconButton>
            <IconButton onClick={handleCancelEdit} color="secondary">
              <Iconify icon="eva:close-circle-outline" width="24" height="24" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={handleMenuOpen}>
              <Iconify icon="eva:more-vertical-fill" width="24" height="24" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={handleEdit}>
                <Iconify icon="eva:edit-fill" width="24" height="24" />
                Edit
              </MenuItem>
              {window.localStorage.getItem("role")=='admin'?

              <MenuItem onClick={handleDeleteClick}>
                <Iconify icon="eva:trash-2-outline" width="24" height="24" />
                Delete
              </MenuItem>:null}
            </Menu>
          </>
        )}
      </TableCell>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="primary" >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}

EventTableRow.propTypes = {
  eventName: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  description: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  status: PropTypes.string,
  location: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  refreshEventList: PropTypes.func.isRequired,
};

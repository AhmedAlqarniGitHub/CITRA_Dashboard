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
} from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function EventTableRow({
  id,
  eventName,
  eventId,
  description,
  startDate,
  endDate,
  status,
  location,
  selected,
  handleClick,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    eventName,
    description,
    startDate,
    endDate,
    location,
  });

  const open = Boolean(anchorEl);

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
    setEditedEvent({
      eventName,
      description,
      startDate,
      endDate,
      location,
    });
  };

  const handleChange = (prop) => (event) => {
    setEditedEvent({ ...editedEvent, [prop]: event.target.value });
  };

  const handleSave = () => {
    // Implement save logic here
    setIsEditMode(false);
  };

  const handleDelete = () => {
    // Implement delete logic here
    handleMenuClose();
  };

  return (
    <TableRow hover tabIndex={-1} selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={(event) => handleClick(event, id)} />
      </TableCell>

      {/* Event ID is not editable */}
      <TableCell>{eventId}</TableCell>

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
          <TableCell>{eventName}</TableCell>
          <TableCell>{description}</TableCell>
          <TableCell>{startDate}</TableCell>
          <TableCell>{endDate}</TableCell>
          <TableCell>{location}</TableCell>
        </>
      )}

      {/* Status is not editable */}
      <TableCell>
        <Label color={(status === 'Active' ? 'success' : 'error')}>{status}</Label>
      </TableCell>

      {/* Action buttons */}
      <TableCell>
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
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEdit}>
                <Iconify icon="eva:edit-fill" width="24" height="24" />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <Iconify icon="eva:trash-2-outline" width="24" height="24" />
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

EventTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  description: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  status: PropTypes.string,
  location: PropTypes.string,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

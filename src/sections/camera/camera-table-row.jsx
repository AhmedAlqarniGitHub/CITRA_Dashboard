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
  Box,
  Stack,
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
  status, // Add this
  eventName, // Add this
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
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    });
  };

  const handleChange = (prop) => (event) => {
    setEditedCamera({ ...editedCamera, [prop]: event.target.value });
  };

  const handleSave = async () => {
    const cameraToUpdate = {
      manufacturer: editedCamera.manufacturer,
      model: editedCamera.model,
      supportedQuality: editedCamera.supportedQuality,
      framesPerSecond: editedCamera.framesPerSecond,
    };

    try {
      let user = {
        id: localStorage.getItem("id"),
      }
      await axios.patch(`${apiBaseUrl}/cameras/update/${id}/${user.id}`,
        cameraToUpdate
      );
      setIsEditMode(false);
      refreshCameraList();
    } catch (error) {
      console.error('Error saving edited camera:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success.main'; // Use Material-UI theme color for success
      case 'in-use':
        return 'warning.main'; // Use Material-UI theme color for warning
      case 'maintenance':
        return 'error.main'; // Use Material-UI theme color for error
      default:
        return 'grey.500'; // Default color for unknown status
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      let user = {
        id: localStorage.getItem('id'),
      };
      await axios.delete(`${apiBaseUrl}/cameras/remove/${id}/${user.id}`);
      refreshCameraList();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting camera:', error);
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={(event) => handleClick(event, id)} />
        </TableCell>

        <TableCell>
          {isEditMode ? (
            <TextField value={editedCamera.manufacturer} onChange={handleChange('manufacturer')} />
          ) : (
            manufacturer
          )}
        </TableCell>

        <TableCell>
          {isEditMode ? (
            <TextField value={editedCamera.model} onChange={handleChange('model')} />
          ) : (
            model
          )}
        </TableCell>

        <TableCell>
          {isEditMode ? (
            <TextField
              value={editedCamera.supportedQuality}
              onChange={handleChange('supportedQuality')}
            />
          ) : (
            supportedQuality
          )}
        </TableCell>

        <TableCell>
          {isEditMode ? (
            <TextField
              type="number"
              value={editedCamera.framesPerSecond}
              onChange={handleChange('framesPerSecond')}
            />
          ) : (
            framesPerSecond
          )}
        </TableCell>
        <TableCell>
          <Typography>{eventName ? eventName : "No specified Event"}</Typography>
        </TableCell>
        <TableCell>
          <Label color={
            status === 'in-use' ? 'info' :
              status === 'available' ? 'success' :
                'error'
          }>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Not recognized"}
          </Label>
        </TableCell>

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
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>
                  <Iconify icon="eva:edit-fill" width="24" height="24" />
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                  <Iconify icon="eva:trash-2-outline" width="24" height="24" />
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </TableCell>
      </TableRow>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this camera?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
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
  supportedQuality: PropTypes.string.isRequired,
  framesPerSecond: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  refreshCameraList: PropTypes.func.isRequired,
  eventName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

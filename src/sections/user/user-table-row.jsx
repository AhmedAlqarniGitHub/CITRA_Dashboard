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
  Avatar,
  Stack,
  Typography,
} from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function UserTableRow({
  id,
  selected,
  name,
  avatarUrl,
  roleName,
  email,
  description,
  handleClick,
  refreshUserList,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name,
    roleName,
    email,
    description,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditedUser({
      name,
      roleName,
      email,
      description,
    });
    setIsEditMode(true);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedUser({
      name,
      roleName,
      email,
      description,
    });
  };

  const handleChange = (prop) => (event) => {
    setEditedUser({ ...editedUser, [prop]: event.target.value });
  };

  const handleSave = async () => {
    const userToUpdate = {
      name: editedUser.name,
      role: editedUser.roleName,
      email: editedUser.email,
      description: editedUser.description,
    };

    try {
      let user = {
        id: localStorage.getItem('id'),
      };
      await axios.patch(`${apiBaseUrl}/users/update/${id}/${user.id}`, userToUpdate);
      refreshUserList();
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving edited data:', error);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      const adminId = localStorage.getItem('id'); // Assuming the admin's ID is stored in local storage
      const response = await axios.delete(`${apiBaseUrl}/users/${id}/${adminId}`); // Pass both the user ID to delete and the admin ID
      refreshUserList();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setDeleteDialogOpen(false);
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

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {isEditMode ? (
                <TextField value={editedUser.name} onChange={handleChange('name')} />
              ) : (
                name
              )}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          {isEditMode ? (
            <TextField
              select
              value={editedUser.roleName}
              onChange={handleChange('roleName')}
            >
              <MenuItem value="organizer">Organizer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="attendee">Attendee</MenuItem>
            </TextField>
          ) : (
            roleName
          )}
        </TableCell>

        <TableCell>
          {isEditMode ? (
            <TextField value={editedUser.email} onChange={handleChange('email')} />
          ) : (
            email
          )}
        </TableCell>

        <TableCell>
          {isEditMode ? (
            <TextField value={editedUser.description} onChange={handleChange('description')} />
          ) : (
            description
          )}
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
            <IconButton onClick={handleMenuOpen}>
              <Iconify icon="eva:more-vertical-fill" width="24" height="24" />
            </IconButton>
          )}
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
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="primary" >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  roleName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  refreshUserList: PropTypes.func.isRequired,
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField'; // Added for inline editing

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  eventName,
  role,
  isVerified,
  status,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    handleCloseMenu();
  };

  const handleSave = () => {
    console.log('Edited name:', editedName);
    setIsEditMode(false);
    // Here you would typically update the state or make an API call to save the changes
  };

  const handleNameChange = (event) => {
    setEditedName(event.target.value);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            {isEditMode ? (
              <TextField
                value={editedName}
                onChange={handleNameChange}
                size="small"
              />
            ) : (
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>
            )}
          </Stack>
        </TableCell>

        <TableCell>{eventName}</TableCell>
        <TableCell>{role}</TableCell>
        <TableCell align="center">{isVerified ? 'Yes' : 'No'}</TableCell>
        <TableCell>
          <Label color={(status === 'inactive' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
          <Popover
            open={!!open}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: { width: 140 },
            }}
          >
            <MenuItem onClick={handleEdit}>
              <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
              Edit
            </MenuItem>
            {isEditMode && (
              <MenuItem onClick={handleSave}>
                <Iconify icon="eva:checkmark-outline" sx={{ mr: 2 }} />
                Save
              </MenuItem>
            )}
            <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
              Delete
            </MenuItem>
          </Popover>
        </TableCell>
      </TableRow>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  eventName: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};

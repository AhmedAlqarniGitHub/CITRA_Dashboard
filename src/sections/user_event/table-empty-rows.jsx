import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function EventTableRow({
  selected,
  id,
  eventName,
  description,
  startDate,
  endDate,
  status,
  handleClick,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <TableRow hover tabIndex={-1} selected={selected} key={id}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onChange={(event) => handleClick(event, id)}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {eventName}
        </Typography>
      </TableCell>
      <TableCell align="left">{description}</TableCell>
      <TableCell align="left">{startDate}</TableCell>
      <TableCell align="left">{endDate}</TableCell>
      <TableCell align="left">
        <Label variant="ghost" color={(status === 'inactive' ? 'error' : 'success')}>
          {status}
        </Label>
      </TableCell>
      <TableCell align="left">{/* Location data if available */}</TableCell>
      <TableCell align="left">{/* Camera data if available */}</TableCell>
      <TableCell align="right">
        <IconButton
          aria-label="more"
          id={`action-button-${id}`}
          aria-controls={isMenuOpen ? `action-menu-${id}` : undefined}
          aria-expanded={isMenuOpen ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleOpenMenu}
        >
          <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
        </IconButton>
      </TableCell>
      <Popover
        id={`action-menu-${id}`}
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" width={24} height={24} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          Delete
        </MenuItem>
      </Popover>
    </TableRow>
  );
}

EventTableRow.propTypes = {
  selected: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

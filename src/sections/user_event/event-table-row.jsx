import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Checkbox, Typography, Box } from '@mui/material';
import Label from 'src/components/label';

export default function EventTableRow({
  id,
  eventName,
  eventId, // Add this line to include the eventId in the props
  description,
  startDate,
  endDate,
  status,
  location,
  selected,
  handleClick,
}) {
  // ... other states and functions remain the same

  return (
    <TableRow hover tabIndex={-1} selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onChange={(event) => handleClick(event, id)}
        />
      </TableCell>
      <TableCell component="th" scope="row" padding="none">
        <Typography variant="subtitle2" noWrap>
          {eventName}
        </Typography>
      </TableCell>
      <TableCell align="left">{eventId}</TableCell> {/* Add this line to display the eventId */}
      <TableCell align="left">{description}</TableCell>
      <TableCell align="left">{startDate}</TableCell>
      <TableCell align="left">{endDate}</TableCell>
      <TableCell align="left">
        <Label variant="ghost" color={(status === 'inactive' ? 'error' : 'success')}>
          {status}
        </Label>
      </TableCell>
      <TableCell align="left">{location}</TableCell>
      {/* Include other cells if necessary */}
    </TableRow>
  );
}

EventTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired, // Add this line to include the eventId in propTypes
  description: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

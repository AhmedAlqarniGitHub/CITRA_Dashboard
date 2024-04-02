import { useState } from 'react';
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

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function CameraTableRow({
  selected,
  manufacturer,
  name,
  supportedQuality,
  framesPerSecond,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{manufacturer}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{supportedQuality}</TableCell>
        <TableCell>{framesPerSecond}</TableCell>

        {/* Actions or any other cells if necessary */}
      </TableRow>

      {/* Popover for actions remains the same */}
    </>
  );
}

CameraTableRow.propTypes = {
  handleClick: PropTypes.func.isRequired,
  manufacturer: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  supportedQuality: PropTypes.string.isRequired,
  framesPerSecond: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};

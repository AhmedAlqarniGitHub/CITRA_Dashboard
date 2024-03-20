import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
 

  
  if (disabledLink) {
    return "logo";
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
    <img
        alt="icon"
        src="/assets/logo.svg"
        style={{
            width: '45px', // Replace 'desiredWidth' with the actual width value, e.g., '100px' or '10rem'
            height: '45px', // Replace 'desiredHeight' with the actual height value, e.g., '100px' or '10rem'
            cursor: 'pointer',
            marginTop:'20px',
            marginLeft:'20px',
            ...sx // Assuming you still want to spread the 'sx' styles if they are applicable here
        }}
    />
</Link>

  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;

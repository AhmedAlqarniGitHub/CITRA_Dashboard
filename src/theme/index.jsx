import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { Box, FormGroup, FormControlLabel, styled } from '@mui/material';
import { palette } from './palette';
import { shadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';

// A custom styled switch component that uses FontAwesome icons
const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 24 24'><path fill='${theme.palette.common.white}' d='${faMoon.icon[4]}' /></svg>`
        )}")`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#ffd740',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 24 24'><path fill='${theme.palette.grey[800]}' d='${faSun.icon[4]}' /></svg>`
      )}")`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme || 'light';
  };

  const [mode, setMode] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const themeConfig = useMemo(
    () => ({
      palette: palette(mode),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    [mode]
  );

  const theme = createTheme(themeConfig);
  theme.components = overrides(theme);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <FormGroup sx={{ position: 'fixed', top: 23, right: 150, zIndex: 1500 }}>
        <FormControlLabel
          control={<ThemeSwitch checked={mode === 'dark'} onChange={toggleTheme} />}
          label={mode === 'dark' ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
          labelPlacement="start"
        />
      </FormGroup>
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

// ThemeToggle.js
import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material/styles';

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
  },}));

export default function ThemeToggle({ mode, onToggle }) {
  const theme = useTheme();
  
  return (
    <ThemeSwitch
      checked={mode === 'dark'}
      onChange={onToggle}
      icon={<FontAwesomeIcon icon={faSun} />}
      checkedIcon={<FontAwesomeIcon icon={faMoon} />}
    />
  );
}

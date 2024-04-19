import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { bgGradient } from 'src/theme/css';


const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function LoginView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/users/login`, loginInfo); // Adjust the URL as needed
      if (response.status === 200) {
        window.localStorage.setItem("id", response.data.info.id);
        window.localStorage.setItem("name", response.data.info.name);
        window.localStorage.setItem("role", response.data.info.role);
        window.localStorage.setItem("email", response.data.info.email);
        window.localStorage.setItem("avatarUrl", response.data.info.avatarUrl);
        window.location.href = '/'; // Redirect to the homepage or another route on successful login
      } else {
        window.localStorage.removeItem("id");
        window.localStorage.removeItem("name");
        window.localStorage.removeItem("role"); 
        window.localStorage.removeItem("email"); 
        window.localStorage.removeItem("avatarUrl");    
        setLoginError('Unexpected error occurred. Please try again.'); // Fallback error message
      }
    } catch (error) {
      // Set the error message from the backend if available, otherwise a generic error message
      window.localStorage.removeItem("id");
      window.localStorage.removeItem("name");
      window.localStorage.removeItem("role"); 
      window.localStorage.removeItem("email");
      window.localStorage.removeItem("avatarUrl");    
      
      setLoginError(error.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Sign in to CITRA
          </Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>


          <Stack spacing={3}>
            <TextField
              name="email"
              label="Email address"
              onChange={handleChange}
              value={loginInfo.email}
              sx={{
                '& .MuiInputBase-root': {
                  '&.Mui-filled': {
                    backgroundColor: 'none'  // Set the desired background color here
                  }
                }
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              value={loginInfo.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': {
                  '&.Mui-filled': {
                    backgroundColor: 'white'  // Set the desired background color here
                  }
                }
              }}
            />

            {loginError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {loginError}
              </Typography>
            )}


            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
              <Link variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack>

            <LoadingButton
              loading={loading}
              fullWidth
              size="large"
              variant="contained"
              onClick={handleLogin}
            >
              Login
            </LoadingButton>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

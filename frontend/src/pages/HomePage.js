import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const HomePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: '16px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E0E0E0'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 80,
                color: '#4CAF50'
              }}
            />
          </Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#0D2D5E'
            }}
          >
            You have logged in!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              color: '#555555',
              fontSize: '1.1rem'
            }}
          >
            Welcome back, <strong>{currentUser?.displayName || currentUser?.email}</strong>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 4,
              color: '#777777'
            }}
          >
            Email: {currentUser?.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: '#0D2D5E',
                color: '#FFFFFF',
                padding: '10px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '50px',
                '&:hover': {
                  backgroundColor: '#0A2348',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;

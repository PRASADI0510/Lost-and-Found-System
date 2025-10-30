import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        padding: '0.5rem 3rem',
        backgroundColor: '#FFFFFF',
        borderBottom: 'none'
      }}
    >
      <Toolbar sx={{ minHeight: '80px' }}>
        <Box
          component={RouterLink}
          to="/home"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            gap: 1.5,
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#507FD9',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: '#000000',
                lineHeight: 1.2,
                fontSize: '1.1rem'
              }}
            >
              Lost and Found
            </Typography>
            <Typography
              variant="caption"
              component="div"
              sx={{
                color: '#666666',
                fontSize: '0.8rem',
                fontWeight: 400
              }}
            >
              The Open University of Sri Lanka
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {/* About button - always visible */}
          <Button
            component={RouterLink}
            to="/about"
            variant="contained"
            sx={{
              backgroundColor: '#507FD9',
              color: '#FFFFFF',
              padding: '8px 28px',
              fontSize: '0.95rem',
              '&:hover': {
                backgroundColor: '#4070C9',
              },
            }}
          >
            About
          </Button>

          {currentUser ? (
            <>
              <Button
                component={RouterLink}
                to="/profile"
                variant="contained"
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  padding: '8px 28px',
                  fontSize: '0.95rem',
                  '&:hover': {
                    backgroundColor: '#4070C9',
                  },
                }}
              >
                Profile
              </Button>
              <Button
                onClick={handleSignOut}
                variant="contained"
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  padding: '8px 28px',
                  fontSize: '0.95rem',
                  '&:hover': {
                    backgroundColor: '#4070C9',
                  },
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  padding: '8px 28px',
                  fontSize: '0.95rem',
                  '&:hover': {
                    backgroundColor: '#4070C9',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/signup"
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  padding: '8px 28px',
                  fontSize: '0.95rem',
                  '&:hover': {
                    backgroundColor: '#4070C9',
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

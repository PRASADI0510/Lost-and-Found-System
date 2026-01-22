import React, { useState } from 'react';
import { Box, Button, Container, Grid, TextField, Typography, Link as MuiLink, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        default:
          setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#0B1F3F',
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 480,
                p: 5,
                borderRadius: '16px',
                bgcolor: '#D4E9F7',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                align="center"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: '#0D2D5E',
                  fontFamily: 'Georgia, serif',
                  fontSize: '2rem'
                }}
              >
                Log In
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.75,
                      color: '#0D2D5E',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}
                  >
                    E- Mail Address
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                      }
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.75,
                      color: '#0D2D5E',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                      }
                    }}
                  />
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 1,
                    mb: 2,
                    backgroundColor: '#0D2D5E',
                    color: '#FFFFFF',
                    borderRadius: '25px',
                    padding: '11px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: '#0A2348',
                    },
                    '&:disabled': {
                      backgroundColor: '#0D2D5E',
                      opacity: 0.6,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                </Button>
              </Box>
              <MuiLink
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                align="center"
                display="block"
                sx={{
                  color: '#0D2D5E',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot Password?
              </MuiLink>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: { xs: 300, md: 380 },
                height: { xs: 300, md: 380 },
                borderRadius: '50%',
                backgroundColor: '#D4E9F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
                alt="Professional person working"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;

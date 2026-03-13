import React, { useState } from 'react';
import { Box, Button, Container, Grid, TextField, Typography, Link as MuiLink, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[0-9+\-() ]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must contain uppercase and lowercase letters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    try {
      setLoading(true);
      await signup(formData.email, formData.password, formData.fullName, 'student', formData.phone);
      navigate('/home');
    } catch (error) {
      console.error('Signup error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setFieldErrors((prev) => ({ ...prev, email: 'An account with this email already exists' }));
          break;
        case 'auth/invalid-email':
          setFieldErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
          break;
        case 'auth/weak-password':
          setFieldErrors((prev) => ({ ...prev, password: 'Password is too weak. Please use at least 6 characters' }));
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputSx = { '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF', borderRadius: '8px' } };

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
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                height: { xs: 300, md: 500 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}
            >
              <Box
                component="img"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '16px',
                }}
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80"
                alt="College students collaborating together"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                p: 5,
                borderRadius: '16px',
                bgcolor: '#D4E9F7',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                maxWidth: 650,
                mx: 'auto'
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
                Create Account
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 0.75, color: '#0D2D5E', fontWeight: 500, fontSize: '0.875rem' }}>
                    Full Name *
                  </Typography>
                  <TextField
                    autoComplete="given-name"
                    name="fullName"
                    fullWidth
                    id="fullName"
                    autoFocus
                    variant="outlined"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.fullName}
                    helperText={fieldErrors.fullName}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 0.75, color: '#0D2D5E', fontWeight: 500, fontSize: '0.875rem' }}>
                    Email *
                  </Typography>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 0.75, color: '#0D2D5E', fontWeight: 500, fontSize: '0.875rem' }}>
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    variant="outlined"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.phone}
                    helperText={fieldErrors.phone}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 0.75, color: '#0D2D5E', fontWeight: 500, fontSize: '0.875rem' }}>
                    Password *
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 0.75, color: '#0D2D5E', fontWeight: 500, fontSize: '0.875rem' }}>
                    Confirm Password *
                  </Typography>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.confirmPassword}
                    helperText={fieldErrors.confirmPassword}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3, mb: 2, backgroundColor: '#0D2D5E', color: '#FFFFFF',
                  borderRadius: '25px', padding: '11px', fontWeight: 600, fontSize: '1rem',
                  '&:hover': { backgroundColor: '#0A2348' },
                  '&:disabled': { backgroundColor: '#0D2D5E', opacity: 0.6 },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
              </Box>
              <MuiLink
                component={RouterLink}
                to="/login"
                variant="body2"
                align="center"
                display="block"
                sx={{
                  color: '#0D2D5E', textDecoration: 'none', fontSize: '0.875rem',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Already have an account?
              </MuiLink>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SignUpPage;

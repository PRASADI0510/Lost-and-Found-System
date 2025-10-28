import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Link as MuiLink, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          setError('Failed to send password reset email. Please try again.');
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
      <Container maxWidth="sm">
        <Box
          sx={{
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
              mb: 2,
              color: '#0D2D5E',
              fontFamily: 'Georgia, serif',
              fontSize: '2rem'
            }}
          >
            Reset Password
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{
              mb: 4,
              color: '#0D2D5E',
              fontSize: '0.9rem'
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
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
                Email Address
              </Typography>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                type="email"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <MuiLink
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{
                color: '#0D2D5E',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Back to Login
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;

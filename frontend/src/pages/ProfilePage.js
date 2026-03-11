import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Grid, Avatar, Button, Alert, CircularProgress
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    sNumber: '',
    faculty: '',
    phoneNumber: '',
    email: '',
    description: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.displayName || currentUser?.displayName || '',
        sNumber: userProfile.sNumber || '',
        faculty: userProfile.faculty || '',
        phoneNumber: userProfile.phone || '',
        email: userProfile.email || currentUser?.email || '',
        description: userProfile.description || ''
      });
    }
  }, [userProfile, currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (formData.sNumber && !/^[a-zA-Z0-9]{3,20}$/.test(formData.sNumber.trim())) {
      errors.sNumber = 'Please enter a valid S number';
    }

    if (formData.faculty && formData.faculty.trim().length < 2) {
      errors.faculty = 'Faculty name must be at least 2 characters';
    }

    if (formData.phoneNumber && !/^[0-9+\-() ]{7,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be under 500 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);
    try {
      await updateUserProfile({
        displayName: formData.name.trim(),
        sNumber: formData.sNumber.trim(),
        faculty: formData.faculty.trim(),
        phone: formData.phoneNumber.trim(),
        description: formData.description.trim()
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#F8F8F8', borderRadius: '8px',
      '& fieldset': { borderColor: '#E0E0E0' },
      '&:hover fieldset': { borderColor: '#C0C0C0' },
      '&.Mui-focused fieldset': { borderColor: '#507FD9' },
    }
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 100px)', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#000000' }}>User Profile</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Avatar
                  sx={{ width: 200, height: 200, backgroundColor: '#507FD9', border: '4px solid #FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '4rem' }}>
                  {(formData.name || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              {userProfile?.role && (
                <Typography variant="body1" align="center" sx={{ color: '#507FD9', fontWeight: 600, textTransform: 'capitalize' }}>
                  {userProfile.role.replace('_', ' ')}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box component="form" sx={{ mt: 8 }}>
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 500, fontSize: '0.95rem' }}>Name *</Typography>
                <TextField fullWidth name="name" variant="outlined" value={formData.name} onChange={handleChange}
                  error={!!fieldErrors.name} helperText={fieldErrors.name} sx={inputSx} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 500, fontSize: '0.95rem' }}>S Number</Typography>
                <TextField fullWidth name="sNumber" variant="outlined" value={formData.sNumber} onChange={handleChange}
                  error={!!fieldErrors.sNumber} helperText={fieldErrors.sNumber} sx={inputSx} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 500, fontSize: '0.95rem' }}>Faculty</Typography>
                <TextField fullWidth name="faculty" variant="outlined" value={formData.faculty} onChange={handleChange}
                  error={!!fieldErrors.faculty} helperText={fieldErrors.faculty} sx={inputSx} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 500, fontSize: '0.95rem' }}>Phone Number</Typography>
                <TextField fullWidth name="phoneNumber" variant="outlined" value={formData.phoneNumber} onChange={handleChange}
                  error={!!fieldErrors.phoneNumber} helperText={fieldErrors.phoneNumber} sx={inputSx} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 500, fontSize: '0.95rem' }}>Email Address</Typography>
                <TextField fullWidth name="email" type="email" variant="outlined" value={formData.email} disabled sx={inputSx} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 500, fontSize: '0.95rem' }}>
                  Description {formData.description.length > 0 && `(${formData.description.length}/500)`}
                </Typography>
                <TextField fullWidth name="description" variant="outlined" multiline rows={4} value={formData.description} onChange={handleChange}
                  error={!!fieldErrors.description} helperText={fieldErrors.description} sx={inputSx} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={handleSave} disabled={loading}
                  sx={{ backgroundColor: '#507FD9', color: '#FFFFFF', padding: '10px 40px', fontSize: '1rem',
                    fontWeight: 600, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: '#4070C9' } }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
                </Button>
                <Button variant="outlined" onClick={async () => { await logout(); navigate('/login'); }}
                  startIcon={<LogoutIcon />}
                  sx={{ padding: '10px 32px', fontSize: '1rem', fontWeight: 600, borderRadius: '8px',
                    textTransform: 'none', color: '#D32F2F', borderColor: '#D32F2F',
                    '&:hover': { backgroundColor: '#FFEBEE', borderColor: '#D32F2F' } }}>
                  Sign Out
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;

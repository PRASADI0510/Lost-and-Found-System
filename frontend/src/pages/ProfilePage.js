import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Avatar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    sNumber: '',
    faculty: '',
    phoneNumber: '',
    email: currentUser?.email || '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        minHeight: 'calc(100vh - 100px)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Left Side - Profile Picture */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: '#000000'
                }}
              >
                User Profile
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: '#F5E6D3',
                    border: '4px solid #FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                    alt="Profile"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Avatar>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Profile Form */}
          <Grid item xs={12} md={8}>
            <Box component="form" sx={{ mt: 8 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                >
                  Name
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C0C0C0',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#507FD9',
                      },
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                >
                  S number
                </Typography>
                <TextField
                  fullWidth
                  name="sNumber"
                  variant="outlined"
                  value={formData.sNumber}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C0C0C0',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#507FD9',
                      },
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                >
                  Faculty
                </Typography>
                <TextField
                  fullWidth
                  name="faculty"
                  variant="outlined"
                  value={formData.faculty}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C0C0C0',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#507FD9',
                      },
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                >
                  Phone number
                </Typography>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  variant="outlined"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C0C0C0',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#507FD9',
                      },
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                >
                  E mail address
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C0C0C0',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#507FD9',
                      },
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                >
                  Description
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C0C0C0',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#507FD9',
                      },
                    }
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;

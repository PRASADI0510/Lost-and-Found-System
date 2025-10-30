import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { useAuth } from '../contexts/AuthContext';

const ReportItemPage = () => {
  const { currentUser } = useAuth();
  const [reportType, setReportType] = useState('lost');
  const [formData, setFormData] = useState({
    itemTitle: '',
    category: '',
    description: '',
    date: '',
    time: '',
    location: '',
    photoOfItem: '',
    yourName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phoneNumber: '',
    handOverPreferences: ''
  });

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setReportType(newType);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClear = () => {
    setFormData({
      itemTitle: '',
      category: '',
      description: '',
      date: '',
      time: '',
      location: '',
      photoOfItem: '',
      yourName: currentUser?.displayName || '',
      email: currentUser?.email || '',
      phoneNumber: '',
      handOverPreferences: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { reportType, ...formData });
    // Handle form submission
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F5F5F5',
        minHeight: 'calc(100vh - 100px)',
        py: 6
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            p: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: '#000000'
            }}
          >
            Report an item
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 4,
              color: '#666666'
            }}
          >
            Use this form to submit a Lost or Found report. Keep details clear and concise.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Type Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  mb: 1.5,
                  color: '#000000',
                  fontWeight: 600
                }}
              >
                Type
              </Typography>
              <ToggleButtonGroup
                value={reportType}
                exclusive
                onChange={handleTypeChange}
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: '20px',
                    px: 3,
                    py: 0.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    border: 'none',
                    '&.Mui-selected': {
                      backgroundColor: '#507FD9',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#4070C9',
                      }
                    },
                    '&:not(.Mui-selected)': {
                      backgroundColor: '#E0E0E0',
                      color: '#666666',
                      '&:hover': {
                        backgroundColor: '#D0D0D0',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="lost">
                  <RadioButtonCheckedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Lost
                </ToggleButton>
                <ToggleButton value="found" sx={{ ml: 1 }}>
                  <RadioButtonCheckedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Found
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Item Title and Category */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                  Item Title
                </Typography>
                <TextField
                  fullWidth
                  name="itemTitle"
                  variant="outlined"
                  value={formData.itemTitle}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                  Category
                </Typography>
                <TextField
                  fullWidth
                  name="category"
                  variant="outlined"
                  value={formData.category}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                name="description"
                variant="outlined"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F8F8F8',
                    borderRadius: '8px',
                  }
                }}
              />
            </Box>

            {/* Date and Time */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                  Date
                </Typography>
                <TextField
                  fullWidth
                  name="date"
                  type="date"
                  variant="outlined"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                  Time
                </Typography>
                <TextField
                  fullWidth
                  name="time"
                  type="time"
                  variant="outlined"
                  value={formData.time}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Location */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                Location
              </Typography>
              <TextField
                fullWidth
                name="location"
                variant="outlined"
                value={formData.location}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F8F8F8',
                    borderRadius: '8px',
                  }
                }}
              />
            </Box>

            {/* Photo Of Item */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                Photo Of Item
              </Typography>
              <TextField
                fullWidth
                name="photoOfItem"
                type="file"
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F8F8F8',
                    borderRadius: '8px',
                  }
                }}
              />
            </Box>

            {/* Your Name and E-Mail */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                  Your Name
                </Typography>
                <TextField
                  fullWidth
                  name="yourName"
                  variant="outlined"
                  value={formData.yourName}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                  E-Mail
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
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Phone Number and Hand Over Preferences */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                  Phone Number
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
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>
                  Hnad Over Preferences
                </Typography>
                <TextField
                  fullWidth
                  name="handOverPreferences"
                  variant="outlined"
                  value={formData.handOverPreferences}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleClear}
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  padding: '10px 32px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#4070C9',
                  },
                }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  padding: '10px 32px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#4070C9',
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ReportItemPage;

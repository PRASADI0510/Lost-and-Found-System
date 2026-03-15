import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Grid,
  ToggleButtonGroup, ToggleButton, Alert, CircularProgress, MenuItem
} from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { findMatches } from '../utils/matchingAlgorithm';
import { notifyMatch, sendMatchEmail } from '../utils/notifications';

function compressImage(file, maxWidth, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

const CATEGORIES = [
  'Wallet', 'Electronics', 'ID Card', 'Keys', 'Bag', 'Book',
  'Clothing', 'Accessories', 'Phone', 'Bottle', 'Umbrella', 'Other'
];

const LOCATIONS = [
  'Library 1st Floor', 'Library 2nd Floor', 'Cafeteria', 'Main Entrance',
  'Computer Lab 1', 'Computer Lab 2', 'Physics Lab', 'Chemistry Lab',
  'Auditorium', 'Parking Area', 'Student Center', 'Admin Building', 'Other'
];

const ReportItemPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { lostItems, foundItems, refresh } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reportType, setReportType] = useState(searchParams.get('type') === 'found' ? 'found' : 'lost');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    itemTitle: '',
    category: '',
    description: '',
    date: '',
    time: '',
    location: '',
    yourName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phoneNumber: userProfile?.phone || '',
    handOverPreferences: ''
  });

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setReportType(newType);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setFormData({
      itemTitle: '', category: '', description: '', date: '', time: '',
      location: '', yourName: currentUser?.displayName || '',
      email: currentUser?.email || '', phoneNumber: userProfile?.phone || '',
      handOverPreferences: ''
    });
    setImageFile(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.itemTitle || !formData.category || !formData.description || !formData.date || !formData.location) {
      setError('Please fill in all required fields (Title, Category, Description, Date, Location)');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to report an item');
      return;
    }

    try {
      setLoading(true);

      let imageUrl = '';
      if (imageFile) {
        imageUrl = await compressImage(imageFile, 800, 0.7);
      }

      const newItem = {
        type: reportType,
        title: formData.itemTitle,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        time: formData.time || '',
        location: formData.location,
        imageUrl,
        postedBy: currentUser.uid,
        postedByName: formData.yourName || currentUser.displayName || '',
        email: formData.email || currentUser.email || '',
        phoneNumber: formData.phoneNumber || '',
        handOverPreferences: formData.handOverPreferences || '',
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'items'), newItem);

      // Refresh DataContext so dashboards/lists show the new item immediately
      await refresh();

      // Run matching algorithm against already-loaded opposite-type items (no extra query)
      try {
        const candidates = reportType === 'lost' ? foundItems : lostItems;
        const itemWithId = { ...newItem, id: docRef.id };
        const matches = findMatches(itemWithId, candidates, 50);

        // Notify top matches (up to 3)
        for (const match of matches.slice(0, 3)) {
          if (match.postedBy) {
            await notifyMatch(match.postedBy, itemWithId, match.matchScore);
          }
          if (match.email) {
            await sendMatchEmail(match.email, match.title, newItem.title, match.matchScore);
          }
        }
      } catch (matchErr) {
        console.error('Matching error (non-blocking):', matchErr);
      }

      setSuccess(`${reportType === 'lost' ? 'Lost' : 'Found'} item reported successfully!`);
      handleClear();
      setTimeout(() => navigate(reportType === 'lost' ? '/lost-items' : '/found-items'), 1500);
    } catch (err) {
      console.error('Error reporting item:', err);
      setError('Failed to report item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: 'calc(100vh - 100px)', py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '12px', p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>
            Report an item
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: '#666666' }}>
            Use this form to submit a Lost or Found report. Keep details clear and concise.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Type Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1.5, color: '#000000', fontWeight: 600 }}>Type</Typography>
              <ToggleButtonGroup
                value={reportType} exclusive onChange={handleTypeChange}
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: '20px', px: 3, py: 0.5, textTransform: 'none', fontWeight: 600, border: 'none',
                    '&.Mui-selected': { backgroundColor: '#507FD9', color: '#FFFFFF', '&:hover': { backgroundColor: '#4070C9' } },
                    '&:not(.Mui-selected)': { backgroundColor: '#E0E0E0', color: '#666666', '&:hover': { backgroundColor: '#D0D0D0' } }
                  }
                }}
              >
                <ToggleButton value="lost"><RadioButtonCheckedIcon sx={{ fontSize: 16, mr: 0.5 }} />Lost</ToggleButton>
                <ToggleButton value="found" sx={{ ml: 1 }}><RadioButtonCheckedIcon sx={{ fontSize: 16, mr: 0.5 }} />Found</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Item Title and Category */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Item Title *</Typography>
                <TextField fullWidth name="itemTitle" variant="outlined" value={formData.itemTitle} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Category *</Typography>
                <TextField fullWidth name="category" variant="outlined" select value={formData.category} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }}>
                  {CATEGORIES.map((cat) => <MenuItem key={cat} value={cat.toLowerCase()}>{cat}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Description *</Typography>
              <TextField fullWidth name="description" variant="outlined" multiline rows={3} value={formData.description} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
            </Box>

            {/* Date and Time */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Date *</Typography>
                <TextField fullWidth name="date" type="date" variant="outlined" value={formData.date} onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Time</Typography>
                <TextField fullWidth name="time" type="time" variant="outlined" value={formData.time} onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
              </Grid>
            </Grid>

            {/* Location */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Location *</Typography>
              <TextField fullWidth name="location" variant="outlined" select value={formData.location} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }}>
                {LOCATIONS.map((loc) => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
              </TextField>
            </Box>

            {/* Photo Of Item */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Photo Of Item</Typography>
              <TextField fullWidth type="file" variant="outlined" onChange={handleFileChange}
                inputProps={{ accept: 'image/*' }}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
            </Box>

            {/* Your Name and E-Mail */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Your Name</Typography>
                <TextField fullWidth name="yourName" variant="outlined" value={formData.yourName} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>E-Mail</Typography>
                <TextField fullWidth name="email" type="email" variant="outlined" value={formData.email} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
              </Grid>
            </Grid>

            {/* Phone Number and Hand Over Preferences */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={reportType === 'found' ? 12 : 6}>
                <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Phone Number</Typography>
                <TextField fullWidth name="phoneNumber" variant="outlined" value={formData.phoneNumber} onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
              </Grid>
              {reportType === 'lost' && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#000000', fontWeight: 600 }}>Hand Over Preferences</Typography>
                  <TextField fullWidth name="handOverPreferences" variant="outlined" value={formData.handOverPreferences} onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
                </Grid>
              )}
            </Grid>

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" onClick={handleClear} disabled={loading}
                sx={{ backgroundColor: '#507FD9', color: '#FFFFFF', padding: '10px 32px', fontSize: '1rem', fontWeight: 600,
                  borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: '#4070C9' } }}>
                Clear
              </Button>
              <Button type="submit" variant="contained" disabled={loading}
                sx={{ backgroundColor: '#507FD9', color: '#FFFFFF', padding: '10px 32px', fontSize: '1rem', fontWeight: 600,
                  borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: '#4070C9' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ReportItemPage;

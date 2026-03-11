import React, { useState } from 'react';
import {
  Dialog, DialogContent, Box, Typography, IconButton, Button, Card, CardContent,
  Chip, TextField, Alert, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ItemDetailModal = ({ open, onClose, item, type }) => {
  const { currentUser, userProfile } = useAuth();
  const { refresh, claims } = useData();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');

  if (!item) return null;

  const handleClaim = async () => {
    if (!claimDescription.trim()) {
      setClaimError('Please describe how you can prove ownership of this item.');
      return;
    }
    if (!currentUser) {
      setClaimError('You must be logged in to claim an item.');
      return;
    }

    setClaimLoading(true);
    setClaimError('');
    try {
      await addDoc(collection(db, 'claims'), {
        itemId: item.id,
        itemTitle: item.title,
        itemType: item.type || type,
        claimantId: currentUser.uid,
        claimantName: currentUser.displayName || '',
        claimantEmail: currentUser.email || '',
        description: claimDescription,
        status: 'pending',
        reviewedBy: null,
        reviewNote: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create notification for item poster
      await addDoc(collection(db, 'notifications'), {
        userId: item.postedBy,
        title: 'New Claim on Your Item',
        message: `${currentUser.displayName || 'Someone'} has claimed "${item.title}".`,
        type: 'claim_update',
        read: false,
        itemId: item.id,
        createdAt: serverTimestamp()
      });

      // Refresh DataContext so claims list updates immediately
      await refresh();
      setClaimSuccess('Claim submitted successfully! You will be notified about the decision.');
      setClaimDescription('');
      setShowClaimForm(false);
    } catch (err) {
      console.error('Error submitting claim:', err);
      setClaimError('Failed to submit claim. Please try again.');
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: '12px', maxHeight: '90vh' } }}>
      <Box sx={{ position: 'relative' }}>
        <IconButton onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left Side */}
            <Box sx={{ flex: 1, p: 3 }}>
              <Box sx={{
                width: '100%', height: 300, backgroundColor: '#E0E0E0', borderRadius: '8px',
                backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : (item.image ? `url(${item.image})` : 'none'),
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                {!item.imageUrl && !item.image && <Typography variant="body2" color="textSecondary">No Image</Typography>}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>{item.title}</Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <LocationOnIcon sx={{ fontSize: 20, mr: 1, color: '#666666' }} />
                  <Typography variant="body1" sx={{ color: '#666666' }}>{item.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 20, mr: 1, color: '#666666' }} />
                  <Typography variant="body1" sx={{ color: '#666666' }}>{item.date}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalOfferIcon sx={{ fontSize: 20, mr: 1, color: '#666666' }} />
                  <Chip label={item.category} sx={{ backgroundColor: '#F0F0F0', color: '#666666', fontSize: '0.875rem', height: '24px' }} />
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: '#666666', lineHeight: 1.6, mb: 3 }}>{item.description}</Typography>
            </Box>

            {/* Right Side */}
            <Box sx={{ width: { xs: '100%', md: '320px' }, backgroundColor: '#F8F8F8', p: 3 }}>
              {/* Contact Info */}
              <Card sx={{ borderRadius: '8px', mb: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000', fontSize: '1rem' }}>
                    {type === 'lost' ? 'Owner Information' : 'Finder Information'}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                      <PersonIcon sx={{ fontSize: 18, mr: 1, color: '#507FD9', mt: 0.3 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#999999', display: 'block' }}>Posted by</Typography>
                        <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                          {item.postedByName || item.postedBy || 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                      <EmailIcon sx={{ fontSize: 18, mr: 1, color: '#507FD9', mt: 0.3 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#999999', display: 'block' }}>Contact</Typography>
                        <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                          {item.email || item.contact || 'N/A'}
                          {item.phoneNumber ? ` | ${item.phoneNumber}` : ''}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <HandshakeIcon sx={{ fontSize: 18, mr: 1, color: '#507FD9', mt: 0.3 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#999999', display: 'block' }}>Handover</Typography>
                        <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                          {item.handOverPreferences || item.handover || 'Contact the poster'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Timeline */}
              {item.timeline && item.timeline.length > 0 && (
                <Card sx={{ borderRadius: '8px', mb: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimelineIcon sx={{ fontSize: 20, mr: 1, color: '#507FD9' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', fontSize: '1rem' }}>Timeline</Typography>
                    </Box>
                    {item.timeline.map((event, index) => (
                      <Box key={index} sx={{ mb: index < item.timeline.length - 1 ? 2 : 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#000000', mb: 0.5 }}>{event.event}</Typography>
                        <Typography variant="caption" sx={{ color: '#666666', display: 'block' }}>{event.time}</Typography>
                        {event.location && <Typography variant="caption" sx={{ color: '#666666' }}>{event.location}</Typography>}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Claim Section */}
              {type === 'found' && (() => {
                const itemClaimed = item.status === 'claimed';
                const userAlreadyClaimed = currentUser && claims.some(
                  (c) => c.itemId === item.id && c.claimantId === currentUser.uid
                );
                return (
                <Box>
                  {claimSuccess && <Alert severity="success" sx={{ mb: 2 }}>{claimSuccess}</Alert>}
                  {claimError && <Alert severity="error" sx={{ mb: 2 }}>{claimError}</Alert>}

                  {itemClaimed ? (
                    <Alert severity="info" sx={{ borderRadius: '8px' }}>
                      This item is already claimed.
                    </Alert>
                  ) : userAlreadyClaimed ? (
                    <Alert severity="info" sx={{ borderRadius: '8px' }}>
                      You have already submitted a claim for this item.
                    </Alert>
                  ) : !showClaimForm ? (
                    <Button fullWidth variant="contained"
                      onClick={() => setShowClaimForm(true)}
                      disabled={!currentUser}
                      sx={{ backgroundColor: '#507FD9', color: '#FFFFFF', padding: '12px', fontSize: '1rem',
                        fontWeight: 600, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: '#4070C9' } }}>
                      {currentUser ? 'Claim This Item' : 'Login to Claim'}
                    </Button>
                  ) : (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                        Describe how you can prove this item is yours:
                      </Typography>
                      <TextField fullWidth multiline rows={3} value={claimDescription}
                        onChange={(e) => setClaimDescription(e.target.value)}
                        placeholder="Describe distinguishing features, serial number, contents, etc."
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF', borderRadius: '8px' } }} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" onClick={() => { setShowClaimForm(false); setClaimError(''); }}
                          sx={{ flex: 1, borderRadius: '8px', textTransform: 'none' }}>
                          Cancel
                        </Button>
                        <Button variant="contained" onClick={handleClaim} disabled={claimLoading}
                          sx={{ flex: 1, backgroundColor: '#507FD9', borderRadius: '8px', textTransform: 'none',
                            '&:hover': { backgroundColor: '#4070C9' } }}>
                          {claimLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit Claim'}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
                );
              })()}
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ItemDetailModal;

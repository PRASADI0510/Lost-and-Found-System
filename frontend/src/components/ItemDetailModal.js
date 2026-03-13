import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, Box, Typography, IconButton, Button, Card, CardContent,
  Chip, TextField, Alert, CircularProgress, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const CATEGORIES = [
  'Wallet', 'Electronics', 'ID Card', 'Keys', 'Bag', 'Book',
  'Clothing', 'Accessories', 'Phone', 'Bottle', 'Umbrella', 'Other'
];

const LOCATIONS = [
  'Library 1st Floor', 'Library 2nd Floor', 'Cafeteria', 'Main Entrance',
  'Computer Lab 1', 'Computer Lab 2', 'Physics Lab', 'Chemistry Lab',
  'Auditorium', 'Parking Area', 'Student Center', 'Admin Building', 'Other'
];

const ItemDetailModal = ({ open, onClose, item, type }) => {
  const { currentUser, userProfile } = useAuth();
  const { refresh, claims } = useData();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [markFoundLoading, setMarkFoundLoading] = useState(false);
  const [markFoundSuccess, setMarkFoundSuccess] = useState('');

  const isOwner = currentUser && item && item.postedBy === currentUser.uid;

  useEffect(() => {
    if (item) {
      setEditData({
        title: item.title || '',
        category: item.category || '',
        description: item.description || '',
        date: item.date || '',
        time: item.time || '',
        location: item.location || '',
        phoneNumber: item.phoneNumber || '',
        handOverPreferences: item.handOverPreferences || ''
      });
    }
    setEditing(false);
    setEditError('');
    setEditSuccess('');
    setMarkFoundSuccess('');
  }, [item]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!editData.title || !editData.category || !editData.description || !editData.date || !editData.location) {
      setEditError('Please fill in all required fields (Title, Category, Description, Date, Location)');
      return;
    }
    setEditLoading(true);
    setEditError('');
    try {
      await updateDoc(doc(db, 'items', item.id), {
        title: editData.title,
        category: editData.category,
        description: editData.description,
        date: editData.date,
        time: editData.time || '',
        location: editData.location,
        phoneNumber: editData.phoneNumber || '',
        handOverPreferences: editData.handOverPreferences || '',
        updatedAt: serverTimestamp()
      });
      await refresh();
      setEditSuccess('Item updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Error updating item:', err);
      setEditError('Failed to update item. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleMarkFound = async () => {
    setMarkFoundLoading(true);
    try {
      await updateDoc(doc(db, 'items', item.id), { status: 'handed_over', updatedAt: serverTimestamp() });

      // Auto-reject all pending requests for this item
      const pendingClaims = claims.filter((c) => c.itemId === item.id && c.status === 'pending');
      for (const claim of pendingClaims) {
        await updateDoc(doc(db, 'claims', claim.id), {
          status: 'denied',
          reviewNote: 'The owner has found this item themselves.',
          updatedAt: serverTimestamp()
        });
        await addDoc(collection(db, 'notifications'), {
          userId: claim.claimantId,
          title: 'Request Closed',
          message: `Your request for "${item.title}" has been closed — the owner found the item themselves.`,
          type: 'claim_update', read: false, itemId: item.id,
          createdAt: serverTimestamp()
        });
      }

      await refresh();
      setMarkFoundSuccess('Item marked as found! Glad you got it back.');
    } catch (err) {
      console.error('Error marking item as found:', err);
    } finally {
      setMarkFoundLoading(false);
    }
  };

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
        <Box sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1, display: 'flex', gap: 1 }}>
          {isOwner && !editing && (
            <IconButton onClick={() => { setEditing(true); setEditSuccess(''); }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
              <EditIcon sx={{ color: '#507FD9' }} />
            </IconButton>
          )}
          <IconButton onClick={onClose}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left Side */}
            <Box sx={{ flex: 1, p: 3 }}>
              {editing ? (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>Edit Item</Typography>
                  {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
                  {editSuccess && <Alert severity="success" sx={{ mb: 2 }}>{editSuccess}</Alert>}

                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Item Title *</Typography>
                  <TextField fullWidth name="title" value={editData.title} onChange={handleEditChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />

                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Category *</Typography>
                  <TextField fullWidth name="category" select value={editData.category} onChange={handleEditChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }}>
                    {CATEGORIES.map((cat) => <MenuItem key={cat} value={cat.toLowerCase()}>{cat}</MenuItem>)}
                  </TextField>

                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Description *</Typography>
                  <TextField fullWidth name="description" multiline rows={3} value={editData.description} onChange={handleEditChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Date *</Typography>
                      <TextField fullWidth name="date" type="date" value={editData.date} onChange={handleEditChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Time</Typography>
                      <TextField fullWidth name="time" type="time" value={editData.time} onChange={handleEditChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Location *</Typography>
                  <TextField fullWidth name="location" select value={editData.location} onChange={handleEditChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }}>
                    {LOCATIONS.map((loc) => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
                  </TextField>

                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Phone Number</Typography>
                  <TextField fullWidth name="phoneNumber" value={editData.phoneNumber} onChange={handleEditChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />

                  {type === 'lost' && (
                    <>
                      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>Hand Over Preferences</Typography>
                      <TextField fullWidth name="handOverPreferences" value={editData.handOverPreferences} onChange={handleEditChange}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
                    </>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => { setEditing(false); setEditError(''); }}
                      sx={{ borderRadius: '8px', textTransform: 'none' }}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleEditSave} disabled={editLoading}
                      sx={{ backgroundColor: '#507FD9', borderRadius: '8px', textTransform: 'none',
                        '&:hover': { backgroundColor: '#4070C9' } }}>
                      {editLoading ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Box sx={{
                    width: '100%', height: 300, backgroundColor: '#E0E0E0', borderRadius: '8px',
                    backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : (item.image ? `url(${item.image})` : 'none'),
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {!item.imageUrl && !item.image && <Typography variant="body2" color="textSecondary">No Image</Typography>}
                  </Box>

                  {editSuccess && <Alert severity="success" sx={{ mb: 2 }}>{editSuccess}</Alert>}

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
                </>
              )}
            </Box>

            {/* Right Side */}
            <Box sx={{ width: { xs: '100%', md: '320px' }, backgroundColor: '#F8F8F8', p: 3 }}>
              {/* Contact Info - only visible to the item owner */}
              {isOwner && (
                <Card sx={{
                  borderRadius: '12px', mb: 2,
                  background: 'linear-gradient(135deg, #507FD9 0%, #3A5FAF 100%)',
                  boxShadow: '0 4px 12px rgba(80, 127, 217, 0.3)',
                  color: '#FFFFFF'
                }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5
                      }}>
                        <PersonIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                        {type === 'lost' ? 'Your Contact Info' : 'Your Contact Info'}
                      </Typography>
                    </Box>

                    <Box sx={{
                      backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '10px', p: 2,
                      display: 'flex', flexDirection: 'column', gap: 1.5
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 1.5, color: 'rgba(255,255,255,0.7)' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Posted by
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>
                            {item.postedByName || item.postedBy || 'Unknown'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.12)' }} />

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1.5, color: 'rgba(255,255,255,0.7)' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Email & Phone
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>
                            {item.email || item.contact || 'N/A'}
                          </Typography>
                          {item.phoneNumber && (
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>
                              {item.phoneNumber}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.12)' }} />

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HandshakeIcon sx={{ fontSize: 16, mr: 1.5, color: 'rgba(255,255,255,0.7)' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Handover
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>
                            {item.handOverPreferences || item.handover || 'Contact the poster'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Mark as Found - owner can self-resolve their lost item */}
              {isOwner && type === 'lost' && item.status === 'open' && !markFoundSuccess && (
                <Button fullWidth variant="contained" startIcon={<CheckCircleIcon />}
                  onClick={handleMarkFound} disabled={markFoundLoading}
                  sx={{ mb: 2, backgroundColor: '#2E7D32', color: '#FFFFFF', padding: '12px', fontSize: '0.95rem',
                    fontWeight: 600, borderRadius: '8px', textTransform: 'none',
                    '&:hover': { backgroundColor: '#1B5E20' } }}>
                  {markFoundLoading ? <CircularProgress size={20} color="inherit" /> : 'I Found My Item'}
                </Button>
              )}
              {markFoundSuccess && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>{markFoundSuccess}</Alert>
              )}

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

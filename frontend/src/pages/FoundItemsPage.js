import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip,
  TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SearchIcon from '@mui/icons-material/Search';
import PanToolIcon from '@mui/icons-material/PanTool';
import ItemDetailModal from '../components/ItemDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FoundItemsPage = () => {
  const { currentUser } = useAuth();
  const { foundItems, claims, refresh } = useData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [claimItem, setClaimItem] = useState(null);
  const [claimDesc, setClaimDesc] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');

  const handleClaimSubmit = async () => {
    if (!claimDesc.trim()) { setClaimError('Please describe how you can prove ownership.'); return; }
    if (!currentUser) { setClaimError('You must be logged in.'); return; }
    setClaimLoading(true);
    setClaimError('');
    try {
      await addDoc(collection(db, 'claims'), {
        itemId: claimItem.id, itemTitle: claimItem.title, itemType: 'found',
        claimantId: currentUser.uid, claimantName: currentUser.displayName || '',
        claimantEmail: currentUser.email || '', description: claimDesc,
        status: 'pending', reviewedBy: null, reviewNote: '',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });
      await addDoc(collection(db, 'notifications'), {
        userId: claimItem.postedBy, title: 'New Claim on Your Item',
        message: `${currentUser.displayName || 'Someone'} has claimed "${claimItem.title}".`,
        type: 'claim_update', read: false, itemId: claimItem.id, createdAt: serverTimestamp()
      });
      await refresh();
      setClaimSuccess('Claim submitted successfully!');
      setClaimDesc('');
      setTimeout(() => { setClaimItem(null); setClaimSuccess(''); }, 1500);
    } catch (err) {
      console.error('Error submitting claim:', err);
      setClaimError('Failed to submit claim. Please try again.');
    } finally { setClaimLoading(false); }
  };

  const items = [...foundItems].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  const filteredItems = items.filter((item) => {
    const matchesSearch = !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: 'calc(100vh - 100px)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>Found Items</Typography>
        <Typography variant="body2" sx={{ mb: 3, color: '#666666' }}>
          Browse items found by community members. Click a card to view details and claim it.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <TextField fullWidth placeholder="Search by title, description, or location..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: '#999' }} /> }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF', borderRadius: '8px' } }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF', borderRadius: '8px' } }}>
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>

        {filteredItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">No found items available</Typography>
            <Typography variant="body2" color="textSecondary">Check back later or try a different search.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{ borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' } }}
                  onClick={() => { setSelectedItem(item); setOpenModal(true); }}>
                  <CardMedia component="div"
                    sx={{ height: 200, backgroundColor: '#E0E0E0',
                      backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'none',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!item.imageUrl && <Typography variant="body2" color="textSecondary">No Image</Typography>}
                  </CardMedia>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>{item.title}</Typography>
                    <Typography variant="body2"
                      sx={{ mb: 2, color: '#666666', display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: '#666666' }} />
                      <Typography variant="body2" sx={{ color: '#666666' }}>{item.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: '#666666' }} />
                      <Typography variant="body2" sx={{ color: '#666666' }}>{item.date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5, color: '#666666' }} />
                      <Chip label={item.category} size="small" sx={{ backgroundColor: '#F0F0F0', color: '#666666', fontSize: '0.75rem', height: '20px' }} />
                    </Box>
                    {currentUser && item.postedBy !== currentUser.uid && item.status !== 'claimed' &&
                      !claims.some((c) => c.itemId === item.id && c.claimantId === currentUser.uid) && (
                      <Button variant="contained" fullWidth startIcon={<PanToolIcon />}
                        onClick={(e) => { e.stopPropagation(); setClaimItem(item); setClaimError(''); setClaimSuccess(''); setClaimDesc(''); }}
                        sx={{ mt: 2, backgroundColor: '#507FD9', color: '#FFFFFF', fontWeight: 600, borderRadius: '8px',
                          textTransform: 'none', fontSize: '0.85rem', py: 1,
                          '&:hover': { backgroundColor: '#4070C9' } }}>
                        Claim This Item
                      </Button>
                    )}
                    {currentUser && claims.some((c) => c.itemId === item.id && c.claimantId === currentUser.uid) && (
                      <Chip label="Claim Submitted" size="small"
                        sx={{ mt: 2, backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontSize: '0.75rem' }} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {selectedItem && (
        <ItemDetailModal open={openModal} onClose={() => { setOpenModal(false); setSelectedItem(null); }} item={selectedItem} type="found" />
      )}

      {/* Claim Dialog */}
      <Dialog open={Boolean(claimItem)} onClose={() => { if (!claimLoading) { setClaimItem(null); setClaimError(''); setClaimSuccess(''); } }}
        maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Claim "{claimItem?.title}"</DialogTitle>
        <DialogContent>
          {claimSuccess && <Alert severity="success" sx={{ mb: 2 }}>{claimSuccess}</Alert>}
          {claimError && <Alert severity="error" sx={{ mb: 2 }}>{claimError}</Alert>}
          {!claimSuccess && (
            <>
              <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                Describe how you can prove this item belongs to you (distinguishing features, serial number, contents, etc.)
              </Typography>
              <TextField fullWidth multiline rows={4} value={claimDesc}
                onChange={(e) => setClaimDesc(e.target.value)}
                placeholder="Provide details to verify your ownership..."
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F8F8F8', borderRadius: '8px' } }} />
            </>
          )}
        </DialogContent>
        {!claimSuccess && (
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => { setClaimItem(null); setClaimError(''); }} disabled={claimLoading}
              sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={handleClaimSubmit} disabled={claimLoading}
              sx={{ backgroundColor: '#507FD9', borderRadius: '8px', textTransform: 'none',
                '&:hover': { backgroundColor: '#4070C9' } }}>
              {claimLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit Claim'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default FoundItemsPage;

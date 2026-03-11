import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent, Chip,
  TextField, MenuItem
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SearchIcon from '@mui/icons-material/Search';
import ItemDetailModal from '../components/ItemDetailModal';
import { useData } from '../contexts/DataContext';

const LostItemsPage = () => {
  const { lostItems } = useData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const items = [...lostItems].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

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
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>Lost Items</Typography>
        <Typography variant="body2" sx={{ mb: 3, color: '#666666' }}>
          Browse and help recover items reported lost by the community.
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
            <Typography variant="h6" color="textSecondary">No lost items found</Typography>
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {selectedItem && (
        <ItemDetailModal open={openModal} onClose={() => { setOpenModal(false); setSelectedItem(null); }} item={selectedItem} type="lost" />
      )}
    </Box>
  );
};

export default LostItemsPage;

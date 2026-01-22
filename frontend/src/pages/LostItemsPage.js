import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ItemDetailModal from '../components/ItemDetailModal';

const LostItemsPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Mock data for lost items
  const lostItems = [
    {
      id: 1,
      title: 'Black wallet',
      description: 'Lost near Library Level 2 around 3 PM. Contains ID and student card.',
      location: 'Library 1st floor',
      date: '2025-03-25',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'elpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)',
      timeline: [
        { event: 'Found', time: '2025-09-10 16:20', location: 'Physics Lab corridor' },
        { event: 'Handed to Security', time: '2025-09-10 16:45', location: '' }
      ]
    },
    {
      id: 2,
      title: 'Laptop Charger',
      description: 'Lost near Library Level 2 around 3 PM. Janiso laptop charger',
      location: 'Library 1st floor',
      date: '2025-03-25',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'elpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    },
    {
      id: 3,
      title: 'Black wallet',
      description: 'Lost near Library Level 2 around 3 PM. Contains ID and student card.',
      location: 'Library 1st floor',
      date: '2025-03-25',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'elpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    },
    {
      id: 4,
      title: 'Laptop Charger',
      description: 'Lost near Library Level 2 around 3 PM. Janiso laptop charger',
      location: 'Library 1st floor',
      date: '2025-03-25',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'elpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    },
    {
      id: 5,
      title: 'Black wallet',
      description: 'Lost near Library Level 2 around 3 PM. Contains ID and student card.',
      location: 'Library 1st floor',
      date: '2025-03-25',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'elpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    },
    {
      id: 6,
      title: 'Laptop Charger',
      description: 'Lost near Library Level 2 around 3 PM. Janiso laptop charger',
      location: 'Library 1st floor',
      date: '2025-03-25',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'elpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    }
  ];

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F5F5F5',
        minHeight: 'calc(100vh - 100px)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: '#000000'
          }}
        >
          Lost Items
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 4,
            color: '#666666'
          }}
        >
          Browse and help recover items reported lost by the community. Click a card to view contact details.
        </Typography>

        <Grid container spacing={3}>
          {lostItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => handleCardClick(item)}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    backgroundColor: '#E0E0E0',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onError={(e) => {
                    e.target.style.backgroundImage = 'none';
                  }}
                >
                  {!item.image && (
                    <Typography variant="body2" color="textSecondary">
                      No Image
                    </Typography>
                  )}
                </CardMedia>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: '#000000'
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: '#666666',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: '#666666' }} />
                    <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                      {item.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: '#666666' }} />
                    <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                      {item.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5, color: '#666666' }} />
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        backgroundColor: '#F0F0F0',
                        color: '#666666',
                        fontSize: '0.75rem',
                        height: '20px'
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          open={openModal}
          onClose={handleCloseModal}
          item={selectedItem}
          type="lost"
        />
      )}
    </Box>
  );
};

export default LostItemsPage;

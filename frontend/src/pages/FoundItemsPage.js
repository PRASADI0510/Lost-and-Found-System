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

const FoundItemsPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Mock data for found items
  const foundItems = [
    {
      id: 1,
      title: 'Blue Water Bottle',
      description: 'Found in cafeteria. Has university sticker on it.',
      location: 'Cafeteria',
      date: '2025-03-26',
      category: 'bottle',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'helpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)',
      timeline: [
        { event: 'Found', time: '2025-09-11 12:30', location: 'Cafeteria Table 5' },
        { event: 'Handed to Security', time: '2025-09-11 13:00', location: '' }
      ]
    },
    {
      id: 2,
      title: 'Student ID Card',
      description: 'Found near entrance gate. Card number S/2023/XXX',
      location: 'Main Entrance',
      date: '2025-03-26',
      category: 'id-card',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'helpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    },
    {
      id: 3,
      title: 'Red Umbrella',
      description: 'Found in Library reading area.',
      location: 'Library 2nd floor',
      date: '2025-03-25',
      category: 'umbrella',
      image: 'https://images.unsplash.com/photo-1534309466160-70b22cc6252c?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'helpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    },
    {
      id: 4,
      title: 'Textbook - Physics',
      description: 'Physics textbook found in Lab 3. Has name written inside.',
      location: 'Physics Lab 3',
      date: '2025-03-24',
      category: 'book',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'helpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    },
    {
      id: 5,
      title: 'Glasses Case',
      description: 'Black glasses case found on bench near parking lot.',
      location: 'Parking Area',
      date: '2025-03-24',
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'helpdesk@campus.edu · 011-123-4567',
      handover: 'Collect from Security Desk (9am-5pm)'
    },
    {
      id: 6,
      title: 'USB Flash Drive',
      description: 'Found in Computer Lab. 16GB capacity.',
      location: 'Computer Lab 1',
      date: '2025-03-23',
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1618410320928-25228d811631?w=400&q=80',
      postedBy: 'Security Office',
      contact: 'helpdesk@campus.edu · 011-123-4567',
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
          Found Items
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 4,
            color: '#666666'
          }}
        >
          Browse items found by community members. If you recognize your item, click the card to view contact details and claim it.
        </Typography>

        <Grid container spacing={3}>
          {foundItems.map((item) => (
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
          type="found"
        />
      )}
    </Box>
  );
};

export default FoundItemsPage;

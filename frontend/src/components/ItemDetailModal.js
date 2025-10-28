import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TimelineIcon from '@mui/icons-material/Timeline';

const ItemDetailModal = ({ open, onClose, item, type }) => {
  if (!item) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '90vh'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left Side - Image and Description */}
            <Box sx={{ flex: 1, p: 3 }}>
              {/* Item Image */}
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  backgroundColor: '#E0E0E0',
                  borderRadius: '8px',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                {!item.image && (
                  <Typography variant="body2" color="textSecondary">
                    No Image
                  </Typography>
                )}
              </Box>

              {/* Item Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#000000'
                }}
              >
                {item.title}
              </Typography>

              {/* Item Details */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <LocationOnIcon sx={{ fontSize: 20, mr: 1, color: '#666666' }} />
                  <Typography variant="body1" sx={{ color: '#666666' }}>
                    {item.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 20, mr: 1, color: '#666666' }} />
                  <Typography variant="body1" sx={{ color: '#666666' }}>
                    {item.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalOfferIcon sx={{ fontSize: 20, mr: 1, color: '#666666' }} />
                  <Chip
                    label={item.category}
                    sx={{
                      backgroundColor: '#F0F0F0',
                      color: '#666666',
                      fontSize: '0.875rem',
                      height: '24px'
                    }}
                  />
                </Box>
              </Box>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: '#666666',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                {item.description}
              </Typography>
            </Box>

            {/* Right Side - Info Cards */}
            <Box
              sx={{
                width: { xs: '100%', md: '320px' },
                backgroundColor: '#F8F8F8',
                p: 3
              }}
            >
              {/* Owner/Finder Info Card */}
              <Card
                sx={{
                  borderRadius: '8px',
                  mb: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: '#000000',
                      fontSize: '1rem'
                    }}
                  >
                    {type === 'lost' ? 'Owner Information' : 'Finder Information'}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                      <PersonIcon sx={{ fontSize: 18, mr: 1, color: '#507FD9', mt: 0.3 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#999999', display: 'block' }}>
                          Posted by
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                          {item.postedBy}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                      <EmailIcon sx={{ fontSize: 18, mr: 1, color: '#507FD9', mt: 0.3 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#999999', display: 'block' }}>
                          Contact
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                          {item.contact}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <HandshakeIcon sx={{ fontSize: 18, mr: 1, color: '#507FD9', mt: 0.3 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#999999', display: 'block' }}>
                          Handover
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                          {item.handover}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Timeline Card (if available) */}
              {item.timeline && item.timeline.length > 0 && (
                <Card
                  sx={{
                    borderRadius: '8px',
                    mb: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimelineIcon sx={{ fontSize: 20, mr: 1, color: '#507FD9' }} />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#000000',
                          fontSize: '1rem'
                        }}
                      >
                        Timeline
                      </Typography>
                    </Box>

                    {item.timeline.map((event, index) => (
                      <Box key={index} sx={{ mb: index < item.timeline.length - 1 ? 2 : 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#000000',
                            mb: 0.5
                          }}
                        >
                          {event.event}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666666', display: 'block' }}>
                          {event.time}
                        </Typography>
                        {event.location && (
                          <Typography variant="caption" sx={{ color: '#666666' }}>
                            {event.location}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Claim Button (for found items) */}
              {type === 'found' && (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: '#507FD9',
                    color: '#FFFFFF',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#4070C9',
                    },
                  }}
                >
                  Claim This Item
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ItemDetailModal;

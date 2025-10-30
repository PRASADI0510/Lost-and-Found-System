import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                lineHeight: 1.2,
                mb: 3,
                color: '#000000'
              }}
            >
              Reunite people with their things—{' '}
              <Typography
                component="span"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  color: '#7FB3FF',
                  display: 'inline'
                }}
              >
                fast &
              </Typography>
              <br />
              <Typography
                component="span"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  color: '#CCAA00',
                  display: 'inline'
                }}
              >
                securely
              </Typography>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                my: 4,
                color: '#555555',
                fontWeight: 400,
                lineHeight: 1.7,
                fontSize: '1.125rem'
              }}
            >
              Report lost items in seconds, browse found items, and get notified when there's a match. Privacy-first and managed by the help desk.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/home')}
              sx={{
                backgroundColor: '#0D2D5E',
                color: '#FFFFFF',
                padding: '12px 40px',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#0A2348',
                },
                mt: 1
              }}
            >
              Dashboard
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: { xs: 350, md: 450 },
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                backgroundColor: '#E5E5E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                component="img"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                src="/landing-image.jpg"
                alt="A person pointing at a laptop screen"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 1.2rem;">Image Placeholder</div>';
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;

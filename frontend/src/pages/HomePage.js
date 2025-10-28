import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

const HomePage = () => {
  const navigate = useNavigate();

  // Mock data for recent activity
  const recentActivity = [
    {
      type: 'Lost',
      title: 'Black wallet',
      location: 'Library Level 2',
      date: '2025-09-10',
      status: 'Open'
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#F5F5F5',
        minHeight: 'calc(100vh - 100px)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Report Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Report Lost Item Card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block'
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 48, color: '#000000' }} />
                  <AddCircleOutlineIcon
                    sx={{
                      fontSize: 20,
                      color: '#000000',
                      position: 'absolute',
                      bottom: -2,
                      right: -2
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      color: '#000000'
                    }}
                  >
                    Report Lost Item
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
                      fontSize: '0.875rem'
                    }}
                  >
                    Create a post with where/when you lost it,
                    <br />
                    photos, and a contact method.
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={() => navigate('/report-item')}
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  padding: '8px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#4070C9',
                  },
                }}
              >
                Lost Item
              </Button>
            </Paper>
          </Grid>

          {/* Report Found Item Card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block'
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 48, color: '#000000' }} />
                  <SearchIcon
                    sx={{
                      fontSize: 20,
                      color: '#000000',
                      position: 'absolute',
                      bottom: -2,
                      right: -2
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      color: '#000000'
                    }}
                  >
                    Report Found Item
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
                      fontSize: '0.875rem'
                    }}
                  >
                    Post details and handover preferences so
                    <br />
                    the owner can contact you.
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={() => navigate('/report-item')}
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  padding: '8px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#4070C9',
                  },
                }}
              >
                Found Item
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={1}
              onClick={() => navigate('/lost-items')}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                    mb: 0.5,
                    fontSize: '0.875rem'
                  }}
                >
                  Open Lost Report
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#000000'
                  }}
                >
                  18
                </Typography>
              </Box>
              <Chip
                label="3 REPORTS"
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: '24px'
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={1}
              onClick={() => navigate('/found-items')}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                    mb: 0.5,
                    fontSize: '0.875rem'
                  }}
                >
                  Open Found Report
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#000000'
                  }}
                >
                  5
                </Typography>
              </Box>
              <Chip
                label="5 REPORTS"
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: '24px'
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={1}
              sx={{
                p: 2.5,
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                    mb: 0.5,
                    fontSize: '0.875rem'
                  }}
                >
                  Matches Pending
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#000000'
                  }}
                >
                  2
                </Typography>
              </Box>
              <Chip
                label="2 REPORTS"
                sx={{
                  backgroundColor: '#507FD9',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: '24px'
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Activity Table */}
        <Paper
          elevation={1}
          sx={{
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2.5, borderBottom: '1px solid #E0E0E0' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#000000'
              }}
            >
              Recent activity
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#666666', fontSize: '0.875rem' }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666666', fontSize: '0.875rem' }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666666', fontSize: '0.875rem' }}>
                    Location
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666666', fontSize: '0.875rem' }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666666', fontSize: '0.875rem' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivity.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: '#000000' }}>{item.type}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{item.title}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{item.location}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{item.date}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;

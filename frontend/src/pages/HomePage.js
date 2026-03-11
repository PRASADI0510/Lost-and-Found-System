import React from 'react';
import {
  Box, Button, Container, Typography, Paper, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { useData } from '../contexts/DataContext';
import { findMatches, getConfidenceLabel, getConfidenceColor } from '../utils/matchingAlgorithm';

const HomePage = () => {
  const navigate = useNavigate();
  const { items, lostItems, foundItems } = useData();

  const recentActivity = [...items]
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    .slice(0, 10);

  // Compute matches from already-loaded data
  const matchSuggestions = [];
  for (const lost of lostItems.slice(0, 10)) {
    const matches = findMatches(lost, foundItems, 50);
    if (matches.length > 0) {
      matchSuggestions.push({ lostItem: lost, foundItem: matches[0], score: matches[0].matchScore });
    }
  }
  matchSuggestions.sort((a, b) => b.score - a.score);

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: 'calc(100vh - 100px)', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2}
              sx={{ p: 3, borderRadius: '12px', backgroundColor: '#FFFFFF', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <DescriptionIcon sx={{ fontSize: 48, color: '#000000' }} />
                  <AddCircleOutlineIcon sx={{ fontSize: 20, color: '#000000', position: 'absolute', bottom: -2, right: -2 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#000000' }}>Report Lost Item</Typography>
                  <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                    Create a post with where/when you lost it,<br />photos, and a contact method.
                  </Typography>
                </Box>
              </Box>
              <Button variant="contained" onClick={() => navigate('/report-item?type=lost')}
                sx={{ backgroundColor: '#507FD9', color: '#FFFFFF', padding: '8px 24px', fontSize: '0.9rem',
                  fontWeight: 600, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: '#4070C9' } }}>
                Lost Item
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2}
              sx={{ p: 3, borderRadius: '12px', backgroundColor: '#FFFFFF', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <DescriptionIcon sx={{ fontSize: 48, color: '#000000' }} />
                  <SearchIcon sx={{ fontSize: 20, color: '#000000', position: 'absolute', bottom: -2, right: -2 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#000000' }}>Report Found Item</Typography>
                  <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                    Post details and handover preferences so<br />the owner can contact you.
                  </Typography>
                </Box>
              </Box>
              <Button variant="contained" onClick={() => navigate('/report-item?type=found')}
                sx={{ backgroundColor: '#507FD9', color: '#FFFFFF', padding: '8px 24px', fontSize: '0.9rem',
                  fontWeight: 600, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: '#4070C9' } }}>
                Found Item
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} onClick={() => navigate('/lost-items')}
              sx={{ p: 2.5, borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>Open Lost Reports</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000' }}>{lostItems.length}</Typography>
              </Box>
              <Chip label={`${lostItems.length} REPORTS`}
                sx={{ backgroundColor: '#507FD9', color: '#FFFFFF', fontWeight: 600, fontSize: '0.7rem', height: '24px' }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} onClick={() => navigate('/found-items')}
              sx={{ p: 2.5, borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#666666', mb: 0.5 }}>Open Found Reports</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000' }}>{foundItems.length}</Typography>
              </Box>
              <Chip label={`${foundItems.length} REPORTS`}
                sx={{ backgroundColor: '#507FD9', color: '#FFFFFF', fontWeight: 600, fontSize: '0.7rem', height: '24px' }} />
            </Paper>
          </Grid>
        </Grid>

        {matchSuggestions.length > 0 && (
          <Paper elevation={1} sx={{ borderRadius: '12px', backgroundColor: '#FFFFFF', overflow: 'hidden', mb: 4 }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid #E0E0E0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000' }}>Potential Matches</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#666' }}>Lost Item</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#666' }}>Found Item</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#666' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#666' }}>Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchSuggestions.slice(0, 5).map((m, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{m.lostItem.title}</TableCell>
                      <TableCell>{m.foundItem.title}</TableCell>
                      <TableCell>{m.lostItem.category}</TableCell>
                      <TableCell>
                        <Chip label={`${m.score}% - ${getConfidenceLabel(m.score)}`} size="small"
                          sx={{ backgroundColor: getConfidenceColor(m.score) + '22', color: getConfidenceColor(m.score), fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Paper elevation={1} sx={{ borderRadius: '12px', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #E0E0E0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000' }}>Recent Activity</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#666' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#666' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivity.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#999' }}>
                      No recent activity. Be the first to report an item!
                    </TableCell>
                  </TableRow>
                ) : (
                  recentActivity.map((item) => (
                    <TableRow key={item.id} hover sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(item.type === 'lost' ? '/lost-items' : '/found-items')}>
                      <TableCell>
                        <Chip label={item.type === 'lost' ? 'Lost' : 'Found'} size="small"
                          sx={{ backgroundColor: item.type === 'lost' ? '#FFEBEE' : '#E8F5E9',
                            color: item.type === 'lost' ? '#D32F2F' : '#2E7D32', fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Chip label={item.status} size="small"
                          sx={{ backgroundColor: item.status === 'open' ? '#E3F2FD' : '#FFF3E0',
                            color: item.status === 'open' ? '#1565C0' : '#E65100', fontWeight: 500 }} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;

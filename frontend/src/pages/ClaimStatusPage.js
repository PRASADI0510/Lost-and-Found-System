import React from 'react';
import {
  Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip
} from '@mui/material';
import { useData } from '../contexts/DataContext';

const ClaimStatusPage = () => {
  const { myClaims } = useData();

  const claims = [...myClaims].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  const statusColor = (s) => ({ pending: '#FFF8E1', approved: '#E8F5E9', denied: '#FFEBEE' }[s] || '#F5F5F5');
  const statusTextColor = (s) => ({ pending: '#F57F17', approved: '#2E7D32', denied: '#C62828' }[s] || '#666');

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: 'calc(100vh - 100px)', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>My Claims & Reports</Typography>
        <Typography variant="body2" sx={{ mb: 4, color: '#666666' }}>
          Track the status of your ownership claims and found item reports.
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
                <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Review Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="textSecondary">You haven't made any claims or reports yet.</Typography>
                    <Typography variant="body2" color="textSecondary">Browse items and submit a claim or report a found item.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                claims.map((claim, index) => (
                  <TableRow key={claim.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Chip label={claim.itemType === 'lost' ? 'I Found This' : 'Ownership Claim'}
                        size="small"
                        sx={{ backgroundColor: claim.itemType === 'lost' ? '#E8F5E9' : '#E3F2FD',
                          color: claim.itemType === 'lost' ? '#2E7D32' : '#1565C0', fontWeight: 600, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{claim.itemTitle}</TableCell>
                    <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {claim.description}
                    </TableCell>
                    <TableCell>
                      <Chip label={claim.status} size="small"
                        sx={{ backgroundColor: statusColor(claim.status), color: statusTextColor(claim.status),
                          fontWeight: 600, textTransform: 'capitalize' }} />
                    </TableCell>
                    <TableCell>{claim.reviewNote || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default ClaimStatusPage;

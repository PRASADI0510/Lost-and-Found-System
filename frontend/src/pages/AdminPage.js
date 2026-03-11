import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Chip, Tabs, Tab, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, Grid
} from '@mui/material';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { exportToCSV, exportToPDF, calculateAnalytics } from '../utils/exportUtils';
import { notifyClaimUpdate, sendClaimStatusEmail } from '../utils/notifications';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const { items, claims, users, refresh, fetchUsers } = useData();
  const [tab, setTab] = useState(0);
  const [reviewDialog, setReviewDialog] = useState({ open: false, claim: null });
  const [reviewNote, setReviewNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const handleMarkClaimed = async (itemId) => {
    setActionLoading(true);
    try {
      await updateDoc(doc(db, 'items', itemId), { status: 'claimed', updatedAt: serverTimestamp() });
      showAlert('Item marked as claimed.');
      refresh();
    } catch (err) {
      showAlert('Failed to update item.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setActionLoading(true);
    try {
      await deleteDoc(doc(db, 'items', itemId));
      showAlert('Item removed.');
      refresh();
    } catch (err) {
      showAlert('Failed to remove item.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewClaim = async (status) => {
    if (!reviewDialog.claim) return;
    setActionLoading(true);
    try {
      const claim = reviewDialog.claim;
      await updateDoc(doc(db, 'claims', claim.id), {
        status,
        reviewedBy: currentUser.uid,
        reviewNote,
        updatedAt: serverTimestamp()
      });

      if (status === 'approved') {
        await updateDoc(doc(db, 'items', claim.itemId), { status: 'claimed', updatedAt: serverTimestamp() });
      }

      // Notify claimant (in-app + email)
      await notifyClaimUpdate(claim.claimantId, claim.itemTitle, status, reviewNote);
      if (claim.claimantEmail) {
        await sendClaimStatusEmail(claim.claimantEmail, claim.itemTitle, status, reviewNote);
      }

      showAlert(`Claim ${status}.`);
      setReviewDialog({ open: false, claim: null });
      setReviewNote('');
      refresh();
    } catch (err) {
      showAlert('Failed to review claim.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const statusColor = (s) => {
    const map = { open: '#E3F2FD', claimed: '#FFF3E0', resolved: '#E8F5E9', pending: '#FFF8E1', approved: '#E8F5E9', denied: '#FFEBEE' };
    return map[s] || '#F5F5F5';
  };
  const statusTextColor = (s) => {
    const map = { open: '#1565C0', claimed: '#E65100', resolved: '#2E7D32', pending: '#F57F17', approved: '#2E7D32', denied: '#C62828' };
    return map[s] || '#666';
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 100px)', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>Admin Panel</Typography>

        {alert.show && <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.message}</Alert>}

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{items.length}</Typography>
              <Typography variant="body2" color="textSecondary">Total Items</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{claims.filter((c) => c.status === 'pending').length}</Typography>
              <Typography variant="body2" color="textSecondary">Pending Claims</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{users.length}</Typography>
              <Typography variant="body2" color="textSecondary">Total Users</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{items.filter((i) => i.status === 'claimed').length}</Typography>
              <Typography variant="body2" color="textSecondary">Items Claimed</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Export Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="outlined" size="small" startIcon={<DownloadIcon />}
            onClick={() => exportToCSV(items, 'items_report', [
              { key: 'type', label: 'Type' }, { key: 'title', label: 'Title' }, { key: 'category', label: 'Category' },
              { key: 'location', label: 'Location' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' },
              { key: 'postedByName', label: 'Posted By' }
            ])}
            sx={{ textTransform: 'none', borderRadius: '6px' }}>
            Export CSV
          </Button>
          <Button variant="outlined" size="small" startIcon={<PictureAsPdfIcon />}
            onClick={() => exportToPDF('Items Report', items, [
              { key: 'type', label: 'Type' }, { key: 'title', label: 'Title' }, { key: 'category', label: 'Category' },
              { key: 'location', label: 'Location' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' },
              { key: 'postedByName', label: 'Posted By' }
            ])}
            sx={{ textTransform: 'none', borderRadius: '6px' }}>
            Export PDF
          </Button>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label={`Items (${items.length})`} />
          <Tab label={`Claims (${claims.length})`} />
          <Tab label={`Users (${users.length})`} />
          <Tab label="Analytics" />
        </Tabs>

        {/* Items Tab */}
        {tab === 0 && (
          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Chip label={item.type === 'lost' ? 'Lost' : 'Found'} size="small"
                        sx={{ backgroundColor: item.type === 'lost' ? '#FFEBEE' : '#E8F5E9',
                          color: item.type === 'lost' ? '#D32F2F' : '#2E7D32', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small"
                        sx={{ backgroundColor: statusColor(item.status), color: statusTextColor(item.status), fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {item.status === 'open' && (
                          <Button variant="contained" size="small" onClick={() => handleMarkClaimed(item.id)}
                            disabled={actionLoading}
                            sx={{ backgroundColor: '#507FD9', textTransform: 'none', borderRadius: '6px', fontSize: '0.8rem',
                              '&:hover': { backgroundColor: '#4070C9' } }}>
                            Mark Claim
                          </Button>
                        )}
                        <Button variant="contained" size="small" onClick={() => handleRemoveItem(item.id)}
                          disabled={actionLoading}
                          sx={{ backgroundColor: '#D32F2F', textTransform: 'none', borderRadius: '6px', fontSize: '0.8rem',
                            '&:hover': { backgroundColor: '#B71C1C' } }}>
                          Remove
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>No items found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Claims Tab */}
        {tab === 1 && (
          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Claimant</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Proof Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claims.map((claim, index) => (
                  <TableRow key={claim.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{claim.itemTitle}</TableCell>
                    <TableCell>{claim.claimantName}</TableCell>
                    <TableCell>{claim.claimantEmail}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {claim.description}
                    </TableCell>
                    <TableCell>
                      <Chip label={claim.status} size="small"
                        sx={{ backgroundColor: statusColor(claim.status), color: statusTextColor(claim.status), fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>
                      {claim.status === 'pending' && (
                        <Button variant="contained" size="small"
                          onClick={() => setReviewDialog({ open: true, claim })}
                          sx={{ backgroundColor: '#507FD9', textTransform: 'none', borderRadius: '6px', fontSize: '0.8rem',
                            '&:hover': { backgroundColor: '#4070C9' } }}>
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {claims.length === 0 && (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No claims found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Users Tab */}
        {tab === 2 && (
          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role || 'student'} size="small"
                        sx={{ textTransform: 'capitalize', backgroundColor: '#E3F2FD', color: '#1565C0', fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Analytics Tab */}
        {tab === 3 && (() => {
          const analytics = calculateAnalytics(items, claims);
          return (
            <Grid container spacing={3}>
              {/* Items by Type */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Items by Type</Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#D32F2F' }}>{analytics.byType.lost}</Typography>
                      <Typography variant="body2" color="textSecondary">Lost</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#2E7D32' }}>{analytics.byType.found}</Typography>
                      <Typography variant="body2" color="textSecondary">Found</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Items by Status */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Items by Status</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {Object.entries(analytics.byStatus).map(([status, count]) => (
                      <Box key={status} sx={{ textAlign: 'center', minWidth: 70 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{count}</Typography>
                        <Chip label={status} size="small" sx={{ textTransform: 'capitalize', mt: 0.5 }} />
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Recovery Rate */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '12px', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Recovery Rate</Typography>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: '#507FD9' }}>{analytics.recoveryRate}%</Typography>
                </Paper>
              </Grid>

              {/* Claim Stats */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Claim Statistics</Typography>
                  {Object.entries(analytics.claimStats).map(([key, val]) => (
                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{key}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{val}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              {/* Top Categories */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Top Categories</Typography>
                  {Object.entries(analytics.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([cat, count]) => (
                      <Box key={cat} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{cat}</Typography>
                        <Chip label={count} size="small" sx={{ minWidth: 32 }} />
                      </Box>
                    ))}
                </Paper>
              </Grid>

              {/* Top Locations */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Top Locations</Typography>
                  {Object.entries(analytics.byLocation)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([loc, count]) => (
                      <Box key={loc} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{loc}</Typography>
                        <Chip label={count} size="small" sx={{ minWidth: 32 }} />
                      </Box>
                    ))}
                </Paper>
              </Grid>

              {/* Monthly Trends */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Monthly Trends</Typography>
                  {Object.entries(analytics.byMonth)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .slice(0, 6)
                    .map(([month, count]) => (
                      <Box key={month} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{month}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: Math.min(count * 20, 150), height: 8, backgroundColor: '#507FD9', borderRadius: 4 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{count}</Typography>
                        </Box>
                      </Box>
                    ))}
                </Paper>
              </Grid>
            </Grid>
          );
        })()}

        {/* Review Dialog */}
        <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, claim: null })} maxWidth="sm" fullWidth>
          <DialogTitle>Review Claim</DialogTitle>
          <DialogContent>
            {reviewDialog.claim && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Item:</strong> {reviewDialog.claim.itemTitle}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Claimant:</strong> {reviewDialog.claim.claimantName} ({reviewDialog.claim.claimantEmail})</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}><strong>Proof of ownership:</strong> {reviewDialog.claim.description}</Typography>
                <TextField fullWidth label="Review Note (optional)" multiline rows={2}
                  value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} sx={{ mt: 1 }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setReviewDialog({ open: false, claim: null })} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={() => handleReviewClaim('denied')} disabled={actionLoading}
              sx={{ textTransform: 'none' }}>
              Deny
            </Button>
            <Button variant="contained" onClick={() => handleReviewClaim('approved')} disabled={actionLoading}
              sx={{ backgroundColor: '#2E7D32', textTransform: 'none', '&:hover': { backgroundColor: '#1B5E20' } }}>
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminPage;

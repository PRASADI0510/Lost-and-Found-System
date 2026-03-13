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
import { createNotification, notifyClaimUpdate, sendClaimStatusEmail } from '../utils/notifications';

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

  const rejectOtherClaims = async (itemId, approvedClaimId) => {
    const otherPending = claims.filter(
      (c) => c.itemId === itemId && c.id !== approvedClaimId && c.status === 'pending'
    );
    for (const other of otherPending) {
      await updateDoc(doc(db, 'claims', other.id), {
        status: 'denied',
        reviewedBy: currentUser.uid,
        reviewNote: 'Another request for this item has been approved.',
        updatedAt: serverTimestamp()
      });
      await notifyClaimUpdate(other.claimantId, other.itemTitle, 'denied', 'Another request for this item has been approved.');
      if (other.claimantEmail) {
        await sendClaimStatusEmail(other.claimantEmail, other.itemTitle, 'denied', 'Another request for this item has been approved.');
      }
    }
  };

  const handleReviewClaim = async (status) => {
    if (!reviewDialog.claim) return;
    setActionLoading(true);
    try {
      const claim = reviewDialog.claim;
      const isFoundReport = claim.itemType === 'lost'; // someone reported finding a lost item

      await updateDoc(doc(db, 'claims', claim.id), {
        status,
        reviewedBy: currentUser.uid,
        reviewNote,
        updatedAt: serverTimestamp()
      });

      if (status === 'approved' && isFoundReport) {
        // "I Found This" flow: item goes to office, notify owner to pick up
        await updateDoc(doc(db, 'items', claim.itemId), { status: 'at_office', updatedAt: serverTimestamp() });

        // Thank the finder
        await notifyClaimUpdate(claim.claimantId, claim.itemTitle, status, reviewNote || 'Thank you for turning in this item!');
        if (claim.claimantEmail) {
          await sendClaimStatusEmail(claim.claimantEmail, claim.itemTitle, status, reviewNote || 'Thank you for turning in this item!');
        }

        // Notify the item owner to come pick it up
        const item = items.find((i) => i.id === claim.itemId);
        if (item && item.postedBy) {
          await createNotification({
            userId: item.postedBy,
            title: 'Your Item Has Been Found!',
            message: `Great news! "${claim.itemTitle}" has been found and is available for pickup at the Main Office. Please bring a valid ID for verification.`,
            type: 'item_found',
            itemId: claim.itemId
          });
        }

        // Auto-reject all other pending requests for this item
        await rejectOtherClaims(claim.itemId, claim.id);
      } else if (status === 'approved') {
        // Regular claim flow: ownership approved
        await updateDoc(doc(db, 'items', claim.itemId), { status: 'claimed', updatedAt: serverTimestamp() });
        await notifyClaimUpdate(claim.claimantId, claim.itemTitle, status, reviewNote);
        if (claim.claimantEmail) {
          await sendClaimStatusEmail(claim.claimantEmail, claim.itemTitle, status, reviewNote);
        }

        // Auto-reject all other pending requests for this item
        await rejectOtherClaims(claim.itemId, claim.id);
      } else {
        // Denied
        await notifyClaimUpdate(claim.claimantId, claim.itemTitle, status, reviewNote);
        if (claim.claimantEmail) {
          await sendClaimStatusEmail(claim.claimantEmail, claim.itemTitle, status, reviewNote);
        }
      }

      showAlert(`${isFoundReport ? 'Found report' : 'Claim'} ${status}.`);
      setReviewDialog({ open: false, claim: null });
      setReviewNote('');
      refresh();
    } catch (err) {
      showAlert('Failed to review.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleHandOver = async (itemId) => {
    setActionLoading(true);
    try {
      const item = items.find((i) => i.id === itemId);
      await updateDoc(doc(db, 'items', itemId), { status: 'handed_over', updatedAt: serverTimestamp() });

      // Notify owner that handover is complete
      if (item && item.postedBy) {
        await createNotification({
          userId: item.postedBy,
          title: 'Item Handed Over',
          message: `"${item.title}" has been successfully handed over. Thank you for using Lost & Found!`,
          type: 'item_handed_over',
          itemId
        });
      }

      showAlert('Item marked as handed over.');
      refresh();
    } catch (err) {
      showAlert('Failed to update item.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const statusColor = (s) => {
    const map = { open: '#E3F2FD', claimed: '#FFF3E0', resolved: '#E8F5E9', pending: '#FFF8E1', approved: '#E8F5E9', denied: '#FFEBEE', at_office: '#E8EAF6', handed_over: '#E8F5E9' };
    return map[s] || '#F5F5F5';
  };
  const statusTextColor = (s) => {
    const map = { open: '#1565C0', claimed: '#E65100', resolved: '#2E7D32', pending: '#F57F17', approved: '#2E7D32', denied: '#C62828', at_office: '#283593', handed_over: '#1B5E20' };
    return map[s] || '#666';
  };
  const statusLabel = (s) => {
    const map = { at_office: 'At Office', handed_over: 'Handed Over' };
    return map[s] || s;
  };

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 100px)', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>Admin Panel</Typography>

        {alert.show && <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.message}</Alert>}

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{items.filter((i) => i.status === 'open').length}</Typography>
              <Typography variant="body2" color="textSecondary">Open Items</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px', border: '2px solid #E8EAF6' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#283593' }}>{items.filter((i) => i.status === 'at_office').length}</Typography>
              <Typography variant="body2" color="textSecondary">At Office</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px', border: '2px solid #E8F5E9' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1B5E20' }}>{items.filter((i) => i.status === 'handed_over' || i.status === 'claimed').length}</Typography>
              <Typography variant="body2" color="textSecondary">Handed Over</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px', border: '2px solid #FFF8E1' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#F57F17' }}>{claims.filter((c) => c.status === 'pending').length}</Typography>
              <Typography variant="body2" color="textSecondary">Pending Reviews</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{items.length}</Typography>
              <Typography variant="body2" color="textSecondary">Total Items</Typography>
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

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} variant="scrollable" scrollButtons="auto">
          <Tab label={`Open Items (${items.filter((i) => i.status === 'open').length})`} />
          <Tab label={`At Office (${items.filter((i) => i.status === 'at_office').length})`} />
          <Tab label={`Handed Over (${items.filter((i) => i.status === 'handed_over' || i.status === 'claimed').length})`} />
          <Tab label={`Found Reports (${claims.filter((c) => c.itemType === 'lost').length})`} />
          <Tab label={`Ownership Claims (${claims.filter((c) => c.itemType === 'found').length})`} />
          <Tab label={`Users (${users.length})`} />
          <Tab label="Analytics" />
        </Tabs>

        {/* Open Items Tab */}
        {tab === 0 && (() => {
          const openItems = items.filter((i) => i.status === 'open');
          return (
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
                  <TableCell sx={{ fontWeight: 600 }}>Posted By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openItems.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Chip label={item.type === 'lost' ? 'Lost' : 'Found'} size="small"
                        sx={{ backgroundColor: item.type === 'lost' ? '#FFEBEE' : '#E8F5E9',
                          color: item.type === 'lost' ? '#D32F2F' : '#2E7D32', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{item.category}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.postedByName || '-'}</TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" onClick={() => handleRemoveItem(item.id)}
                        disabled={actionLoading}
                        sx={{ backgroundColor: '#D32F2F', textTransform: 'none', borderRadius: '6px', fontSize: '0.8rem',
                          '&:hover': { backgroundColor: '#B71C1C' } }}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {openItems.length === 0 && (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>No open items.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          );
        })()}

        {/* At Office Tab */}
        {tab === 1 && (() => {
          const atOfficeItems = items.filter((i) => i.status === 'at_office');
          return (
          <Box>
            <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
              These items have been found and are waiting at the Main Office for their owners to pick up.
              Click <strong>Hand Over</strong> once the owner collects the item.
            </Alert>
            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#E8EAF6' }}>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Location Found</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {atOfficeItems.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{item.title}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.postedByName || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" size="small" onClick={() => handleHandOver(item.id)}
                            disabled={actionLoading}
                            sx={{ backgroundColor: '#2E7D32', textTransform: 'none', borderRadius: '6px', fontSize: '0.8rem',
                              '&:hover': { backgroundColor: '#1B5E20' } }}>
                            Hand Over
                          </Button>
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
                  {atOfficeItems.length === 0 && (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No items at office.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          );
        })()}

        {/* Handed Over Tab */}
        {tab === 2 && (() => {
          const handedOverItems = items.filter((i) => i.status === 'handed_over' || i.status === 'claimed');
          return (
          <Box>
            <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
              These items have been successfully returned to their owners.
            </Alert>
            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Owner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {handedOverItems.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Chip label={item.type === 'lost' ? 'Lost' : 'Found'} size="small"
                          sx={{ backgroundColor: item.type === 'lost' ? '#FFEBEE' : '#E8F5E9',
                            color: item.type === 'lost' ? '#D32F2F' : '#2E7D32', fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.postedByName || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {handedOverItems.length === 0 && (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No handed over items yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          );
        })()}

        {/* Found Reports Tab - "I Found This" requests for lost items */}
        {tab === 3 && (() => {
          const foundReports = claims.filter((c) => c.itemType === 'lost');
          return (
          <Box>
            <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
              These are reports from people who found a lost item. Accept to receive the item at the Main Office and notify the owner.
            </Alert>
            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Lost Item</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Found By</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foundReports.map((claim, index) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{claim.itemTitle}</TableCell>
                      <TableCell>{claim.claimantName}</TableCell>
                      <TableCell>{claim.claimantEmail}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {claim.description}
                      </TableCell>
                      <TableCell>
                        <Chip label={claim.status} size="small"
                          sx={{ backgroundColor: statusColor(claim.status), color: statusTextColor(claim.status), fontWeight: 500, textTransform: 'capitalize' }} />
                      </TableCell>
                      <TableCell>
                        {claim.status === 'pending' && (
                          <Button variant="contained" size="small"
                            onClick={() => setReviewDialog({ open: true, claim })}
                            sx={{ backgroundColor: '#2E7D32', textTransform: 'none', borderRadius: '6px', fontSize: '0.8rem',
                              '&:hover': { backgroundColor: '#1B5E20' } }}>
                            Review
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {foundReports.length === 0 && (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No found reports yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          );
        })()}

        {/* Ownership Claims Tab - claims on found items */}
        {tab === 4 && (() => {
          const ownershipClaims = claims.filter((c) => c.itemType === 'found');
          return (
          <Box>
            <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
              These are ownership claims from people who say a found item belongs to them. Review proof of ownership before approving.
            </Alert>
            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#E3F2FD' }}>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Found Item</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Claimed By</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Proof of Ownership</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ownershipClaims.map((claim, index) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{claim.itemTitle}</TableCell>
                      <TableCell>{claim.claimantName}</TableCell>
                      <TableCell>{claim.claimantEmail}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {claim.description}
                      </TableCell>
                      <TableCell>
                        <Chip label={claim.status} size="small"
                          sx={{ backgroundColor: statusColor(claim.status), color: statusTextColor(claim.status), fontWeight: 500, textTransform: 'capitalize' }} />
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
                  {ownershipClaims.length === 0 && (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No ownership claims yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          );
        })()}

        {/* Users Tab */}
        {tab === 5 && (
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
        {tab === 6 && (() => {
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
        <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, claim: null })} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: '12px' } }}>
          {reviewDialog.claim && (() => {
            const isFoundReport = reviewDialog.claim.itemType === 'lost';
            return (
              <>
                <DialogTitle sx={{ fontWeight: 700 }}>
                  {isFoundReport ? 'Review Found Report' : 'Review Ownership Claim'}
                </DialogTitle>
                <DialogContent>
                  <Box>
                    <Chip label={isFoundReport ? 'Someone found this lost item' : 'Someone is claiming a found item'}
                      size="small" sx={{ mb: 2, backgroundColor: isFoundReport ? '#E8F5E9' : '#E3F2FD',
                        color: isFoundReport ? '#2E7D32' : '#1565C0', fontWeight: 600 }} />
                    <Typography variant="body2" sx={{ mb: 1 }}><strong>Item:</strong> {reviewDialog.claim.itemTitle}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}><strong>Submitted by:</strong> {reviewDialog.claim.claimantName} ({reviewDialog.claim.claimantEmail})</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>{isFoundReport ? 'Details:' : 'Proof of ownership:'}</strong> {reviewDialog.claim.description}
                    </Typography>
                    {isFoundReport && (
                      <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
                        Approving will mark the item as "At Office" and notify the owner to come pick it up from the Main Office.
                      </Alert>
                    )}
                    <TextField fullWidth label="Review Note (optional)" multiline rows={2}
                      value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} sx={{ mt: 1 }} />
                  </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button onClick={() => setReviewDialog({ open: false, claim: null })} sx={{ textTransform: 'none' }}>Cancel</Button>
                  <Button variant="contained" color="error" onClick={() => handleReviewClaim('denied')} disabled={actionLoading}
                    sx={{ textTransform: 'none' }}>
                    Deny
                  </Button>
                  <Button variant="contained" onClick={() => handleReviewClaim('approved')} disabled={actionLoading}
                    sx={{ backgroundColor: '#2E7D32', textTransform: 'none', '&:hover': { backgroundColor: '#1B5E20' } }}>
                    {isFoundReport ? 'Accept & Notify Owner' : 'Approve'}
                  </Button>
                </DialogActions>
              </>
            );
          })()}
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminPage;

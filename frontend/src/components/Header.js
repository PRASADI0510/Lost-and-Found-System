import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Menu,
  MenuItem, ListItemText, Divider
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { notifications, unreadCount, setNotifications } = useData();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMarkRead = async (notifId) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
      setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const isSecurityOfficer = userProfile?.role === 'security_officer';
  const sortedNotifs = [...notifications].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 20);

  const btnSx = {
    backgroundColor: '#507FD9', color: '#FFFFFF', padding: '8px 28px', fontSize: '0.95rem',
    '&:hover': { backgroundColor: '#4070C9' },
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}
      sx={{ padding: '0.5rem 3rem', backgroundColor: '#FFFFFF', borderBottom: 'none' }}>
      <Toolbar sx={{ minHeight: '80px' }}>
        <Box component={RouterLink} to="/home"
          sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1.5, textDecoration: 'none',
            cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
          <Box sx={{ width: 48, height: 48, backgroundColor: '#507FD9', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />
          </Box>
          <Box>
            <Typography variant="h6" component="div"
              sx={{ fontWeight: 700, color: '#000000', lineHeight: 1.2, fontSize: '1.1rem' }}>
              Lost and Found
            </Typography>
            <Typography variant="caption" component="div"
              sx={{ color: '#666666', fontSize: '0.8rem', fontWeight: 400 }}>
              The Open University of Sri Lanka
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button component={RouterLink} to="/about" variant="contained" sx={btnSx}>About</Button>

          {currentUser ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: '#507FD9' }}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { maxHeight: 400, width: 350 } }}>
                <MenuItem disabled><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography></MenuItem>
                <Divider />
                {sortedNotifs.length === 0 ? (
                  <MenuItem disabled><ListItemText primary="No notifications" /></MenuItem>
                ) : (
                  sortedNotifs.map((n) => (
                    <MenuItem key={n.id} onClick={() => { handleMarkRead(n.id); setAnchorEl(null); }}
                      sx={{ backgroundColor: n.read ? 'transparent' : '#F0F7FF', whiteSpace: 'normal' }}>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 700 }}>{n.title}</Typography>}
                        secondary={n.message} />
                    </MenuItem>
                  ))
                )}
              </Menu>

              {(isAdmin || isSecurityOfficer) && (
                <Button component={RouterLink} to="/admin" variant="contained" sx={btnSx}>Admin</Button>
              )}

              <Button component={RouterLink} to="/my-claims" variant="contained" sx={btnSx}>My Claims</Button>
              <Button component={RouterLink} to="/profile" variant="contained" sx={btnSx}>Profile</Button>
              <Button onClick={handleSignOut} variant="contained" sx={btnSx}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" variant="contained" sx={btnSx}>Login</Button>
              <Button variant="contained" component={RouterLink} to="/signup" sx={btnSx}>Sign Up</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Menu,
  MenuItem, ListItemText, Divider, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, useTheme, useMediaQuery, Collapse
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { notifications, unreadCount, setNotifications } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileNotificationsOpen, setMobileNotificationsOpen] = useState(false);

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
      setMobileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const isSecurityOfficer = userProfile?.role === 'security_officer';
  const sortedNotifs = [...notifications].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 20);

  // Navigation items
  const navItems = [
    { label: 'Home', path: '/home', icon: <HomeIcon />, show: true },
    { label: 'Lost', path: '/lost-items', icon: <SearchIcon />, show: true },
    { label: 'Found', path: '/found-items', icon: <InventoryIcon />, show: true },
    { label: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon />, show: currentUser && (isAdmin || isSecurityOfficer) },
    { label: 'Claims', path: '/my-claims', icon: <AssignmentIcon />, show: currentUser },
    { label: 'Profile', path: '/profile', icon: <PersonIcon />, show: currentUser },
    { label: 'About', path: '/about', icon: <InfoIcon />, show: true },
  ];

  // Button styles - responsive and smaller
  const btnSx = {
    backgroundColor: '#507FD9',
    color: '#FFFFFF',
    fontSize: isMobile ? '0.7rem' : isTablet ? '0.75rem' : '0.85rem',
    padding: isMobile ? '5px 10px' : isTablet ? '6px 14px' : '7px 18px',
    minWidth: isMobile ? '50px' : isTablet ? '60px' : '70px',
    '&:hover': { backgroundColor: '#4070C9' },
  };

  // Mobile Drawer
  const MobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: '80%',
          maxWidth: '320px',
          backgroundColor: '#FFFFFF',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Drawer Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Menu</Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Info */}
        {currentUser && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#F5F5F5', borderRadius: '12px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {userProfile?.displayName || currentUser.email}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {userProfile?.role || 'Student'}
            </Typography>
          </Box>
        )}

        {/* Navigation Items */}
        <List sx={{ mb: 2 }}>
          {navItems.filter(item => item.show).map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    backgroundColor: '#E8F0FE',
                    '& .MuiListItemIcon-root': { color: '#507FD9' },
                    '& .MuiListItemText-primary': { color: '#507FD9', fontWeight: 600 },
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Notifications Section for Mobile */}
        {currentUser && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setMobileNotificationsOpen(!mobileNotificationsOpen)}
                sx={{ borderRadius: '8px' }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Notifications" />
                {mobileNotificationsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            
            <Collapse in={mobileNotificationsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2 }}>
                {sortedNotifs.length === 0 ? (
                  <ListItem>
                    <Typography variant="body2" color="textSecondary">No notifications</Typography>
                  </ListItem>
                ) : (
                  sortedNotifs.slice(0, 5).map((n) => (
                    <ListItem
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      sx={{
                        backgroundColor: n.read ? 'transparent' : '#F0F7FF',
                        borderRadius: '8px',
                        mb: 1,
                        cursor: 'pointer'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 700 }}>
                            {n.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ 
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                          }}>
                            {n.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Collapse>
            
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Auth Actions - Only show login/signup for non-authenticated users */}
        {!currentUser && (
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
                onClick={() => setMobileMenuOpen(false)}
                sx={{ 
                  backgroundColor: '#507FD9',
                  '&:hover': { backgroundColor: '#4070C9' },
                  py: 1.5, 
                  borderRadius: '8px' 
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={RouterLink}
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  borderColor: '#507FD9',
                  color: '#507FD9',
                  py: 1.5,
                  borderRadius: '8px',
                  '&:hover': {
                    borderColor: '#4070C9',
                    backgroundColor: '#F0F7FF'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="transparent" 
        elevation={0}
        sx={{ 
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          padding: isMobile ? '0' : '0 1rem',
        }}
      >
        <Toolbar 
          sx={{ 
            minHeight: isMobile ? '56px' : isTablet ? '64px' : '70px',
            px: isMobile ? 1.5 : 2.5,
          }}
        >
          {/* Logo Section */}
          <Box 
            component={RouterLink} 
            to="/home"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
              gap: isMobile ? 0.8 : 1.2, 
              textDecoration: 'none',
              cursor: 'pointer', 
              '&:hover': { opacity: 0.8 } 
            }}
          >
            <Box sx={{ 
              width: isMobile ? 32 : isTablet ? 36 : 40, 
              height: isMobile ? 32 : isTablet ? 36 : 40, 
              backgroundColor: '#507FD9', 
              borderRadius: '8px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ShieldIcon sx={{ fontSize: isMobile ? 18 : isTablet ? 22 : 24, color: '#FFFFFF' }} />
            </Box>
            <Box sx={{ display: isMobile && !isTablet ? 'none' : 'block' }}>
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  fontWeight: 700, 
                  color: '#000000', 
                  lineHeight: 1.1, 
                  fontSize: isMobile ? '0.85rem' : isTablet ? '0.95rem' : '1.05rem' 
                }}
              >
                Lost and Found
              </Typography>
              <Typography 
                variant="caption" 
                component="div"
                sx={{ 
                  color: '#666666', 
                  fontSize: isMobile ? '0.6rem' : isTablet ? '0.7rem' : '0.75rem', 
                  fontWeight: 400,
                  display: isTablet ? 'none' : 'block',
                  lineHeight: 1
                }}
              >
                The Open University of Sri Lanka
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: isTablet ? 0.3 : 0.5, alignItems: 'center' }}>
              {navItems.filter(item => item.show).map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  variant="contained"
                  sx={{
                    ...btnSx,
                    backgroundColor: location.pathname === item.path ? '#4070C9' : '#507FD9',
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {currentUser && (
                <>
                  <IconButton 
                    onClick={(e) => setAnchorEl(e.currentTarget)} 
                    sx={{ 
                      color: '#507FD9',
                      ml: 0.5,
                      padding: '6px',
                    }}
                  >
                    <Badge badgeContent={unreadCount} color="error">
                      <NotificationsIcon sx={{ fontSize: isTablet ? 20 : 22 }} />
                    </Badge>
                  </IconButton>

                  {/* Desktop Notifications Dropdown */}
                  <Menu 
                    anchorEl={anchorEl} 
                    open={Boolean(anchorEl)} 
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{ 
                      sx: { 
                        maxHeight: 400, 
                        width: 350,
                        borderRadius: '12px'
                      } 
                    }}
                  >
                    <MenuItem disabled>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Notifications
                      </Typography>
                    </MenuItem>
                    <Divider />
                    {sortedNotifs.length === 0 ? (
                      <MenuItem disabled>
                        <ListItemText primary="No notifications" />
                      </MenuItem>
                    ) : (
                      sortedNotifs.map((n) => (
                        <MenuItem 
                          key={n.id} 
                          onClick={() => { 
                            handleMarkRead(n.id); 
                            setAnchorEl(null); 
                          }}
                          sx={{ 
                            backgroundColor: n.read ? 'transparent' : '#F0F7FF', 
                            whiteSpace: 'normal' 
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 700 }}>
                                {n.title}
                              </Typography>
                            }
                            secondary={n.message}
                          />
                        </MenuItem>
                      ))
                    )}
                  </Menu>
                </>
              )}

              {!currentUser && (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    sx={btnSx}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/signup"
                    sx={{
                      borderColor: '#507FD9',
                      color: '#507FD9',
                      fontSize: isTablet ? '0.85rem' : '0.95rem',
                      padding: isTablet ? '7px 16px' : '8px 20px',
                      '&:hover': {
                        borderColor: '#4070C9',
                        backgroundColor: '#F0F7FF'
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {currentUser && (
                <IconButton
                  sx={{ color: '#507FD9' }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon sx={{ fontSize: 22 }} />
                  </Badge>
                </IconButton>
              )}
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ color: '#507FD9' }}
              >
                <MenuIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && <MobileDrawer />}
    </>
  );
};

export default Header;
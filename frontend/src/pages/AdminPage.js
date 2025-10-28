import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';

const AdminPage = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      type: 'Lost',
      title: 'Black Wallet',
      category: 'Wallet',
      place: 'Library, 1st Floor',
      date: '2025-9-13'
    },
    {
      id: 2,
      type: 'Found',
      title: 'Blue Water Bottle',
      category: 'Bottle',
      place: 'Cafeteria',
      date: '2025-9-14'
    },
    {
      id: 3,
      type: 'Lost',
      title: 'Laptop Charger',
      category: 'Electronics',
      place: 'Computer Lab 1',
      date: '2025-9-12'
    },
    {
      id: 4,
      type: 'Found',
      title: 'Student ID Card',
      category: 'ID Card',
      place: 'Main Entrance',
      date: '2025-9-15'
    }
  ]);

  const handleMarkClaim = (id) => {
    console.log('Mark claim for item:', id);
    // Handle mark claim logic
  };

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
    console.log('Removed item:', id);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        minHeight: 'calc(100vh - 100px)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: '#000000'
          }}
        >
          Admin Panel
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
                <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.95rem' }}>

                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.95rem' }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.95rem' }}>
                  Title
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.95rem' }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.95rem' }}>
                  Place
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.95rem' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#000000', fontSize: '0.95rem' }}>

                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#FAFAFA'
                    }
                  }}
                >
                  <TableCell sx={{ color: '#000000', fontWeight: 500 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ color: '#000000' }}>
                    {item.type}
                  </TableCell>
                  <TableCell sx={{ color: '#000000' }}>
                    {item.title}
                  </TableCell>
                  <TableCell sx={{ color: '#000000' }}>
                    {item.category}
                  </TableCell>
                  <TableCell sx={{ color: '#000000' }}>
                    {item.place}
                  </TableCell>
                  <TableCell sx={{ color: '#000000' }}>
                    {item.date}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleMarkClaim(item.id)}
                        sx={{
                          backgroundColor: '#507FD9',
                          color: '#FFFFFF',
                          padding: '6px 20px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          borderRadius: '6px',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#4070C9',
                          },
                        }}
                      >
                        Mark Claim
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleRemove(item.id)}
                        sx={{
                          backgroundColor: '#507FD9',
                          color: '#FFFFFF',
                          padding: '6px 20px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          borderRadius: '6px',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#4070C9',
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default AdminPage;

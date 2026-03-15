import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Card, CardContent, Typography, Box, Chip, useTheme, useMediaQuery
} from '@mui/material';

const ResponsiveTable = ({ columns, rows, renderActions, mobileCardView = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Mobile Card View
  if (isMobile && mobileCardView) {
    return (
      <Box sx={{ width: '100%' }}>
        {rows.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              No data available
            </Typography>
          </Card>
        ) : (
          rows.map((row, index) => (
            <Card 
              key={row.id || index} 
              sx={{ 
                mb: 2, 
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:last-child': { mb: 0 }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                {columns.map((column) => {
                  // Skip rendering if it's marked as hideOnMobile
                  if (column.hideOnMobile) return null;
                  
                  const value = row[column.field];
                  
                  // Special rendering for different field types
                  if (column.renderCell) {
                    return (
                      <Box key={column.field} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#666', 
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {column.headerName}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {column.renderCell({ value, row })}
                        </Box>
                      </Box>
                    );
                  }
                  
                  // Default rendering
                  return (
                    <Box key={column.field} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#666', 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          fontSize: '0.7rem',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {column.headerName}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 0.5,
                          fontWeight: column.emphasize ? 600 : 400,
                          color: column.emphasize ? '#000' : '#333'
                        }}
                      >
                        {value || '-'}
                      </Typography>
                    </Box>
                  );
                })}
                
                {/* Actions */}
                {renderActions && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E0E0E0' }}>
                    {renderActions(row)}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  }

  // Desktop/Tablet Table View
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      }}
    >
      <Table sx={{ minWidth: isTablet ? 600 : 800 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8F8F8' }}>
            {columns.map((column) => (
              // Hide column on tablet if specified
              (!isTablet || !column.hideOnTablet) && (
                <TableCell 
                  key={column.field}
                  sx={{ 
                    fontWeight: 600,
                    fontSize: isTablet ? '0.85rem' : '0.95rem',
                    padding: isTablet ? '12px' : '16px',
                    whiteSpace: 'nowrap'
                  }}
                  align={column.align || 'left'}
                >
                  {column.headerName}
                </TableCell>
              )
            ))}
            {renderActions && (
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  fontSize: isTablet ? '0.85rem' : '0.95rem',
                  padding: isTablet ? '12px' : '16px'
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length + (renderActions ? 1 : 0)} 
                align="center" 
                sx={{ py: 6 }}
              >
                <Typography variant="body1" color="textSecondary">
                  No data available
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow 
                key={row.id || index} 
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: '#F5F8FF'
                  }
                }}
              >
                {columns.map((column) => {
                  // Hide column on tablet if specified
                  if (isTablet && column.hideOnTablet) return null;
                  
                  const value = row[column.field];
                  
                  return (
                    <TableCell 
                      key={column.field}
                      sx={{ 
                        fontSize: isTablet ? '0.8rem' : '0.9rem',
                        padding: isTablet ? '10px 12px' : '14px 16px',
                        maxWidth: column.maxWidth || 'auto',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: column.wrap ? 'normal' : 'nowrap'
                      }}
                      align={column.align || 'left'}
                    >
                      {column.renderCell ? 
                        column.renderCell({ value, row }) : 
                        (value || '-')
                      }
                    </TableCell>
                  );
                })}
                {renderActions && (
                  <TableCell
                    sx={{ 
                      fontSize: isTablet ? '0.8rem' : '0.9rem',
                      padding: isTablet ? '10px 12px' : '14px 16px'
                    }}
                  >
                    {renderActions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Helper component for status chips with responsive sizing
export const ResponsiveChip = ({ label, status, size = 'medium' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const getStatusColor = (status) => {
    const colors = {
      open: { bg: '#E3F2FD', text: '#1565C0' },
      claimed: { bg: '#FFF3E0', text: '#E65100' },
      pending: { bg: '#FFF8E1', text: '#F57F17' },
      approved: { bg: '#E8F5E9', text: '#2E7D32' },
      denied: { bg: '#FFEBEE', text: '#C62828' },
      at_office: { bg: '#E8EAF6', text: '#283593' },
      handed_over: { bg: '#E8F5E9', text: '#1B5E20' },
      lost: { bg: '#FFEBEE', text: '#D32F2F' },
      found: { bg: '#E8F5E9', text: '#2E7D32' }
    };
    return colors[status] || { bg: '#F5F5F5', text: '#666' };
  };

  const colors = getStatusColor(status);
  
  return (
    <Chip 
      label={label}
      size={isMobile ? 'small' : size}
      sx={{ 
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 600,
        fontSize: isMobile ? '0.7rem' : '0.8rem',
        height: isMobile ? '22px' : 'auto',
        textTransform: 'capitalize'
      }}
    />
  );
};

export default ResponsiveTable;
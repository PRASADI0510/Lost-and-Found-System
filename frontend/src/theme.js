import { createTheme } from '@mui/material/styles';
import { muiBreakpoints } from './theme/responsive';

// Create a fully responsive theme instance
const theme = createTheme({
  breakpoints: muiBreakpoints,
  palette: {
    mode: 'light',
    primary: {
      main: '#0D2D5E', // Dark navy blue for buttons
    },
    secondary: {
      main: '#4A7FD9', // Medium blue for header buttons
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
      dark: '#0B1F3F', // Very dark navy for login/signup backgrounds
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
    // Custom colors from screenshots
    gold: {
      main: '#CCAA00', // Gold/yellow for "securely"
    },
    lightBlue: {
      main: '#7FB3FF', // Light blue for "fast &"
    },
    formBackground: {
      main: '#D4E9F7', // Light cyan/blue for form containers
    },
    buttonBlue: {
      main: '#507FD9', // Blue for header buttons
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: 'clamp(1.75rem, 5vw, 5rem)',
      lineHeight: 1.2,
      // Responsive font sizes
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:900px)': {
        fontSize: '3.5rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '3.75rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '5rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '6rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 4vw, 4rem)',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.75rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '3rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '4rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '5rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.25rem, 3vw, 3rem)',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.25rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '3rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '4rem',
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: 'clamp(1.125rem, 2.5vw, 2.5rem)',
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.875rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '2rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '3rem',
      },
    },
    h5: {
      fontWeight: 500,
      fontSize: 'clamp(1rem, 2vw, 2rem)',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.5rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '1.625rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '2rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '2.5rem',
      },
    },
    h6: {
      fontWeight: 400,
      fontSize: 'clamp(0.875rem, 1.5vw, 1.75rem)',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:600px)': {
        fontSize: '1.125rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '1.375rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '2.25rem',
      },
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.2vw, 1.5rem)',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '1rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '1.5rem',
      },
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1vw, 1.25rem)',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.75rem',
      },
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '1.125rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '1.25rem',
      },
    },
    caption: {
      fontSize: 'clamp(0.625rem, 0.8vw, 1rem)',
      '@media (max-width:600px)': {
        fontSize: '0.625rem',
      },
      '@media (min-width:600px)': {
        fontSize: '0.75rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '0.75rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '1rem',
      },
    },
    button: {
      fontSize: 'clamp(0.875rem, 1.2vw, 1.5rem)',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '1rem',
      },
      '@media (min-width:2560px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:3840px)': {
        fontSize: '1.5rem',
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width:600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          },
          '@media (min-width:900px)': {
            paddingLeft: 32,
            paddingRight: 32,
          },
          '@media (min-width:1200px)': {
            paddingLeft: 48,
            paddingRight: 48,
          },
          '@media (min-width:2560px)': {
            maxWidth: 2400,
            paddingLeft: 64,
            paddingRight: 64,
          },
          '@media (min-width:3840px)': {
            maxWidth: 3600,
            paddingLeft: 96,
            paddingRight: 96,
          },
        },
        maxWidthXs: {
          '@media (min-width:600px)': {
            maxWidth: 600,
          },
        },
        maxWidthSm: {
          '@media (min-width:600px)': {
            maxWidth: 600,
          },
          '@media (min-width:900px)': {
            maxWidth: 900,
          },
        },
        maxWidthMd: {
          '@media (min-width:900px)': {
            maxWidth: 900,
          },
          '@media (min-width:1200px)': {
            maxWidth: 1200,
          },
        },
        maxWidthLg: {
          '@media (min-width:1200px)': {
            maxWidth: 1200,
          },
          '@media (min-width:1536px)': {
            maxWidth: 1536,
          },
        },
        maxWidthXl: {
          '@media (min-width:1536px)': {
            maxWidth: 1536,
          },
          '@media (min-width:2560px)': {
            maxWidth: 2400,
          },
          '@media (min-width:3840px)': {
            maxWidth: 3600,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
        contained: {
          borderRadius: '50px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          // Responsive padding and sizes
          '@media (max-width:600px)': {
            padding: '8px 20px',
            fontSize: '0.875rem',
            minHeight: '36px',
          },
          '@media (min-width:600px)': {
            padding: '10px 28px',
            fontSize: '1rem',
            minHeight: '42px',
          },
          '@media (min-width:900px)': {
            padding: '10px 32px',
            fontSize: '1rem',
            minHeight: '44px',
          },
          '@media (min-width:1200px)': {
            padding: '12px 36px',
            fontSize: '1rem',
            minHeight: '48px',
          },
          '@media (min-width:2560px)': {
            padding: '16px 48px',
            fontSize: '1.25rem',
            minHeight: '60px',
          },
          '@media (min-width:3840px)': {
            padding: '20px 64px',
            fontSize: '1.5rem',
            minHeight: '72px',
            borderRadius: '60px',
          },
        },
        outlined: {
          '@media (max-width:600px)': {
            padding: '7px 20px',
          },
          '@media (min-width:600px)': {
            padding: '9px 28px',
          },
          '@media (min-width:900px)': {
            padding: '9px 32px',
          },
          '@media (min-width:1200px)': {
            padding: '11px 36px',
          },
          '@media (min-width:2560px)': {
            padding: '15px 48px',
          },
          '@media (min-width:3840px)': {
            padding: '19px 64px',
          },
        },
        text: {
          '@media (max-width:600px)': {
            padding: '8px 12px',
          },
          '@media (min-width:600px)': {
            padding: '10px 16px',
          },
          '@media (min-width:900px)': {
            padding: '10px 20px',
          },
          '@media (min-width:1200px)': {
            padding: '12px 24px',
          },
          '@media (min-width:2560px)': {
            padding: '16px 32px',
          },
          '@media (min-width:3840px)': {
            padding: '20px 40px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            transition: 'all 0.3s ease',
            // Responsive input heights
            '@media (max-width:600px)': {
              '& input': {
                padding: '10px 12px',
                fontSize: '0.875rem',
              },
            },
            '@media (min-width:600px)': {
              '& input': {
                padding: '12px 14px',
                fontSize: '1rem',
              },
            },
            '@media (min-width:900px)': {
              '& input': {
                padding: '14px 16px',
                fontSize: '1rem',
              },
            },
            '@media (min-width:1200px)': {
              '& input': {
                padding: '16px 18px',
                fontSize: '1rem',
              },
            },
            '@media (min-width:2560px)': {
              '& input': {
                padding: '20px 24px',
                fontSize: '1.25rem',
              },
              borderRadius: '12px',
            },
            '@media (min-width:3840px)': {
              '& input': {
                padding: '24px 32px',
                fontSize: '1.5rem',
              },
              borderRadius: '16px',
            },
            '& fieldset': {
              borderColor: '#D0D0D0',
              borderWidth: '1px',
              '@media (min-width:2560px)': {
                borderWidth: '1.5px',
              },
              '@media (min-width:3840px)': {
                borderWidth: '2px',
              },
            },
            '&:hover fieldset': {
              borderColor: '#A0A0A0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#507FD9',
              borderWidth: '2px',
              '@media (min-width:3840px)': {
                borderWidth: '3px',
              },
            },
          },
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '@media (max-width:600px)': {
            padding: '12px',
            borderRadius: '8px',
          },
          '@media (min-width:600px)': {
            padding: '16px',
            borderRadius: '10px',
          },
          '@media (min-width:900px)': {
            padding: '20px',
            borderRadius: '12px',
          },
          '@media (min-width:1200px)': {
            padding: '24px',
            borderRadius: '12px',
          },
          '@media (min-width:2560px)': {
            padding: '32px',
            borderRadius: '16px',
          },
          '@media (min-width:3840px)': {
            padding: '48px',
            borderRadius: '24px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            height: '24px',
            fontSize: '0.75rem',
          },
          '@media (min-width:600px)': {
            height: '28px',
            fontSize: '0.813rem',
          },
          '@media (min-width:900px)': {
            height: '32px',
            fontSize: '0.875rem',
          },
          '@media (min-width:1200px)': {
            height: '32px',
            fontSize: '0.875rem',
          },
          '@media (min-width:2560px)': {
            height: '40px',
            fontSize: '1.125rem',
          },
          '@media (min-width:3840px)': {
            height: '48px',
            fontSize: '1.375rem',
            borderRadius: '24px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media (max-width:600px)': {
            margin: '16px',
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)',
          },
          '@media (min-width:600px)': {
            margin: '24px',
            width: 'calc(100% - 48px)',
            maxHeight: 'calc(100% - 48px)',
          },
          '@media (min-width:900px)': {
            margin: '32px',
          },
          '@media (min-width:1200px)': {
            margin: '32px',
          },
          '@media (min-width:2560px)': {
            margin: '48px',
            borderRadius: '16px',
          },
          '@media (min-width:3840px)': {
            margin: '64px',
            borderRadius: '24px',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            fontSize: '0.75rem',
          },
          '@media (min-width:600px)': {
            fontSize: '0.875rem',
          },
          '@media (min-width:900px)': {
            fontSize: '1rem',
          },
          '@media (min-width:2560px)': {
            fontSize: '1.25rem',
          },
          '@media (min-width:3840px)': {
            fontSize: '1.5rem',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px',
            fontSize: '0.75rem',
          },
          '@media (min-width:600px)': {
            padding: '12px',
            fontSize: '0.875rem',
          },
          '@media (min-width:900px)': {
            padding: '16px',
            fontSize: '1rem',
          },
          '@media (min-width:2560px)': {
            padding: '20px',
            fontSize: '1.25rem',
          },
          '@media (min-width:3840px)': {
            padding: '24px',
            fontSize: '1.5rem',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px',
          },
          '@media (min-width:600px)': {
            padding: '10px',
          },
          '@media (min-width:900px)': {
            padding: '12px',
          },
          '@media (min-width:2560px)': {
            padding: '16px',
          },
          '@media (min-width:3840px)': {
            padding: '20px',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          // Responsive spacing
          '@media (max-width:600px)': {
            '& .MuiGrid-container': {
              spacing: 2,
            },
          },
          '@media (min-width:600px)': {
            '& .MuiGrid-container': {
              spacing: 3,
            },
          },
          '@media (min-width:900px)': {
            '& .MuiGrid-container': {
              spacing: 3,
            },
          },
          '@media (min-width:1200px)': {
            '& .MuiGrid-container': {
              spacing: 4,
            },
          },
          '@media (min-width:2560px)': {
            '& .MuiGrid-container': {
              spacing: 5,
            },
          },
          '@media (min-width:3840px)': {
            '& .MuiGrid-container': {
              spacing: 6,
            },
          },
        },
      },
    },
  },
  // Custom spacing for different screen sizes
  spacing: (factor) => {
    // Dynamic spacing based on viewport
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 600) return `${factor * 4}px`; // Mobile
      if (width < 900) return `${factor * 6}px`; // Tablet
      if (width < 1200) return `${factor * 8}px`; // Desktop
      if (width < 2560) return `${factor * 8}px`; // HD
      if (width < 3840) return `${factor * 10}px`; // 2K
      return `${factor * 12}px`; // 4K and above
    }
    return `${factor * 8}px`; // Default
  },
});

export default theme;
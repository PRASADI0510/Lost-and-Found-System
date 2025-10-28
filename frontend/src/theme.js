import { createTheme } from '@mui/material/styles';

// Create a theme instance to match the design screenshots exactly
const theme = createTheme({
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
      fontSize: '3.75rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 400,
      fontSize: '1.125rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '50px',
          textTransform: 'none',
          padding: '10px 32px',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        root: {
          textTransform: 'none',
          fontWeight: 600,
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#D0D0D0',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: '#A0A0A0',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#507FD9',
              borderWidth: '2px',
            },
          },
        }
      }
    }
  },
});

export default theme;

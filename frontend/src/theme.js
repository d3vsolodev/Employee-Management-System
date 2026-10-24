import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      light: '#818cf8',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0891b2',
      light: '#22d3ee',
      dark: '#0e7490',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f7fc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
    error: {
      main: '#e11d48',
    },
    warning: {
      main: '#d97706',
    },
    info: {
      main: '#0284c7',
    },
    success: {
      main: '#059669',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(115deg, #3730a3 0%, #4f46e5 55%, #0891b2 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(148, 163, 184, 0.16)',
          boxShadow: '0 12px 32px rgba(30, 41, 59, 0.07)',
          transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
          '&:hover': {
            borderColor: 'rgba(79, 70, 229, 0.28)',
            boxShadow: '0 18px 38px rgba(30, 41, 59, 0.11)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#818cf8',
          },
        },
      },
    },
  },
});

export default theme;

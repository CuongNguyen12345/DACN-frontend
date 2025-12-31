import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9333ea',
      light: '#a855f7',
      dark: '#7e22ce',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: 'clamp(2.3rem, 3.3vw, 3.4rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#0f172a',
    },
    h2: {
      fontSize: '1.4rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#0f172a',
    },
    h3: {
      fontSize: '1.05rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#111827',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
      color: '#4b5563',
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
      color: '#6b7280',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.8rem',
      lineHeight: 1.4,
      color: '#6b7280',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.05)',
    '0 4px 6px rgba(0, 0, 0, 0.05)',
    '0 10px 15px rgba(0, 0, 0, 0.05)',
    '0 10px 25px rgba(15, 23, 42, 0.02)',
    '0 10px 30px rgba(15, 23, 42, 0.08)',
    '0 15px 35px rgba(15, 23, 42, 0.1)',
    '0 20px 45px rgba(15, 23, 42, 0.15)',
    '0 20px 45px rgba(15, 23, 42, 0.7)',
    '0 25px 50px rgba(0, 0, 0, 0.1)',
    '0 30px 60px rgba(0, 0, 0, 0.1)',
    '0 35px 70px rgba(0, 0, 0, 0.1)',
    '0 40px 80px rgba(0, 0, 0, 0.1)',
    '0 45px 90px rgba(0, 0, 0, 0.1)',
    '0 50px 100px rgba(0, 0, 0, 0.1)',
    '0 55px 110px rgba(0, 0, 0, 0.1)',
    '0 60px 120px rgba(0, 0, 0, 0.1)',
    '0 65px 130px rgba(0, 0, 0, 0.1)',
    '0 70px 140px rgba(0, 0, 0, 0.1)',
    '0 75px 150px rgba(0, 0, 0, 0.1)',
    '0 80px 160px rgba(0, 0, 0, 0.1)',
    '0 85px 170px rgba(0, 0, 0, 0.1)',
    '0 90px 180px rgba(0, 0, 0, 0.1)',
    '0 95px 190px rgba(0, 0, 0, 0.1)',
    '0 100px 200px rgba(0, 0, 0, 0.1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '999px',
          padding: '0.55rem 1.35rem',
          fontSize: '0.9rem',
          transition: 'all 0.18s ease-out',
        },
        contained: {
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            transform: 'translateY(-1px)',
          },
        },
        sizeLarge: {
          padding: '0.75rem 1.75rem',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '0.4rem 1rem',
          fontSize: '0.8rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.02)',
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563eb',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563eb',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation0: {
          boxShadow: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8,
});

export default theme;


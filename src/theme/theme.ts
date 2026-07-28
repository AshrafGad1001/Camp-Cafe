import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#2C1E16', // Rich Espresso Dark
      light: '#4A3B32',
      dark: '#1A120D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D97706', // Vibrant Caramel/Amber
      light: '#F59E0B',
      dark: '#B45309',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Crisp modern green
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#F8FAFC', // Very clean slate-50
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Cairo", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, color: '#1E293B' },
    h2: { fontWeight: 700, color: '#1E293B' },
    h3: { fontWeight: 700, color: '#1E293B' },
    h4: { fontWeight: 700, color: '#1E293B', letterSpacing: '-0.5px' },
    h5: { fontWeight: 600, color: '#1E293B' },
    h6: { fontWeight: 600, color: '#1E293B' },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
        },
      },
    },
  },
});

export default theme;

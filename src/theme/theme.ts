import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#0F3040',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#215E61',
      contrastText: '#ffffff',
    },
    success: {
      main: '#558467',
    },
    background: {
      default: '#EBEDE3',
      paper: '#D3D4C0',
    },
    text: {
      primary: '#0F3040',
      secondary: '#215E61',
    },
  },
  typography: {
    fontFamily: '"Cairo", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      color: '#0F3040',
    },
    h2: {
      fontWeight: 700,
      color: '#0F3040',
    },
    h3: {
      fontWeight: 600,
      color: '#215E61',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
        },

      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(15, 48, 64, 0.05)',
          backgroundColor: '#D3D4C0',
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
          backgroundColor: '#D3D4C0',
          borderRight: '1px solid rgba(15, 48, 64, 0.1)',
        },
      },
    },
  },
});

export default theme;

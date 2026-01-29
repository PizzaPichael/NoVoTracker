import React from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import AppLayout from './AppLayout';
import { AppBarProvider } from './Providers/AppBarProvider';

const colors = {
  secondary: '#E8E5F5',
  primary: '#1F3442',
  accent: '#C2B9E4',
  special: '#6F0D27',
};

const theme = createTheme({
  ...colors,
  components: {
    MuiCssBaseline: {
      styleOverrides: () => ({
        html: {
          width: '100%',
          height: '100%',
        },
        body: {
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
        },
        '#app': {
          width: '100%',
          height: '100%',
        },
      }),
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        background: 'red',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: colors.accent,
          color: 'black',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: colors.primary,
          borderRadius: 20,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          background: colors.primary,
          color: colors.accent,
          borderRadius: 20,
          '&.Mui-selected': {
            color: '#FFFFFF',
          },
        },
      },
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
<AppBarProvider>
  <AppLayout />
</AppBarProvider>
);

// register the Workbox‐generated service worker.
// It tells the client to install the service worker which is needed for PWA functionality.
// The service handles all kinds of background tasks like caching of static files and updating them when they change.
// It could also handle push notifications.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('SW registered:', reg))
      .catch((err) => console.error('SW registration failed:', err));
  });
}

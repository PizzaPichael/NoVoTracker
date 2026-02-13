import React from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import AppLayout from './AppLayout';
import { AppBarProvider } from './Providers/AppBarProvider';

// Capacitor SQLite imports
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { initDB } from './utils/storage';

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
        '#root': {
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

// Exportierte App-Komponente
export function App() {
  return (
    <AppBarProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </AppBarProvider>
  );
}

// jeep-sqlite Custom Elements registrieren
jeepSqlite(window);

// Auf DOMContentLoaded warten, dann SQLite initialisieren und React rendern
window.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform();
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  
  try {
    if (platform === "web") {
      // jeep-sqlite Element zum DOM hinzufügen
      const jeepEl = document.createElement("jeep-sqlite");
      jeepEl.setAttribute("wasmpath", "./");
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      
      // Web Store initialisieren (am SQLiteConnection-Objekt, nicht am Element)
      await sqlite.initWebStore();
      
      console.log('jeep-sqlite initialized successfully');
    }
    
    // Datenbank initialisieren
    await initDB();
    console.log('Database initialized successfully');
    
    // React App starten
    const container = document.getElementById('root');
    if (container) {
      const root = createRoot(container);
      root.render(<App />);
    }

  } catch (err) {
    console.error(`Error: ${err}`);
    throw new Error(`Error: ${err}`);
  }
});

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

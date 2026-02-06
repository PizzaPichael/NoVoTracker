import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import {
  Stack,
  Container,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';

import { Home as HomeIcon } from '@mui/icons-material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import EmergencyIcon from '@mui/icons-material/Emergency';
import AppRoutes from './AppRoutes';
import CustomAppBar from './Components/CustomAppBar';

const BOTTOM_NAV_HEIGHT = 60; // Höhe des Bottom Menus in px

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let navigationIndex = 0;
  if (location.pathname.startsWith('/pantry')) navigationIndex = 0;
  if (location.pathname.startsWith('/home')) navigationIndex = 1;
  if (location.pathname.startsWith('/emergency')) navigationIndex = 2;

  const pathsToHideBottomNav = ['/'];
  const showBottomNav = !pathsToHideBottomNav.includes(location.pathname);

  const pathsToHideTopAppBar = ['/'];
  const showTopAppBar = !pathsToHideTopAppBar.includes(location.pathname);

  return (
    <Stack
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {showTopAppBar && (
        <Container
          sx={{
            height: '50px',
            flexShrink: 0,
            width: '100%',
          }}
        >
          <CustomAppBar />
        </Container>
      )}

      <Stack
        sx={{
          flex: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          width: '90%',
          alignSelf: 'center',
          pt: '10px',
          px: '0px',
          pb: showBottomNav ? `${BOTTOM_NAV_HEIGHT + 20}px` : '20px', // Dynamischer Platz für BottomNav
        }}
        alignItems="center"
      >
        <AppRoutes />
      </Stack>
      {showBottomNav && (
        <BottomNavigation
          showLabels
          value={navigationIndex}
          sx={{
            width: '90%',
            height: `${BOTTOM_NAV_HEIGHT}px`,
            position: 'fixed',
            bottom: 10,
            left: '5%',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          <BottomNavigationAction
            label="Vorräte"
            icon={<KitchenIcon />}
            onClick={() => navigate('/pantry')}
          />
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            onClick={() => navigate('/home')}
          />
          <BottomNavigationAction
            label="Notfalll-Liste"
            icon={<EmergencyIcon />}
            onClick={() => navigate('/emergency')}
          />
        </BottomNavigation>
      )}
    </Stack>
  );
};

export default AppLayout;

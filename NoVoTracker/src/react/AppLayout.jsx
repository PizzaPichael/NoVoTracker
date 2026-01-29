import React from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import {
  Stack,
  Container,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material'

import {
  Home as HomeIcon,
  ImportContacts as ImpfpassIcon,
  Flight as ReisenIcon
} from '@mui/icons-material'
import AppRoutes from './AppRoutes'
import CustomAppBar from './Components/CustomAppBar'

const AppLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  let navigationIndex = 0
  if (location.pathname.startsWith('/')) navigationIndex = 0
  if (location.pathname.startsWith('/vaccinations')) navigationIndex = 2
  if (location.pathname.startsWith('/travel')) navigationIndex = 1

  const pathsToHideBottomNav = ['/', '/first_home', '/create_person']
  const showBottomNav = !pathsToHideBottomNav.includes(location.pathname)

  const pathsToHideTopAppBar = ['/', '/first_home', '/create_person']
  const showTopAppBar = !pathsToHideTopAppBar.includes(location.pathname)

  return (
    <Stack
      sx={{
        height: '100%'
      }}
    >
      {showTopAppBar && (
        <Container
          sx={{
            height: '50px',
            width: '100%'
          }}
        >
          <CustomAppBar />
        </Container>
      )}

      <Stack
        sx={{
          flex: '1 1 auto',
          height: 'calc(100% - 125px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          width: '90%',
          alignSelf: 'center',
          pt: '20px',
          px: '0px'
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
            height: '75px',
            position: 'absolute',
            bottom: 25,
            left: '5%',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            onClick={() => navigate('/home')}
          />
          <BottomNavigationAction
            label="Reisen"
            icon={<ReisenIcon />}
            onClick={() => navigate('/travel')}
          />
          <BottomNavigationAction
            label="Impfpass"
            icon={<ImpfpassIcon />}
            onClick={() => navigate('/vaccinations')}
          />
        </BottomNavigation>
      )}
    </Stack>
  )
}

export default AppLayout

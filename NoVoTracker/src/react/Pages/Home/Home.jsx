import React, { useEffect } from 'react'

import { Stack, Typography, Divider, List, Button } from '@mui/material'
import { Settings } from '@mui/icons-material'

import { useAppBar } from '../../Providers/AppBarProvider'


const Home = () => {
  const { setConfig } = useAppBar()

  useEffect(() => {
    setConfig({
      showBackButton: false,
      backPath: '/',
      icon: <Settings />,
      title: 'NoVo-Tracker'
    })
  }, [setConfig])

  const dividerSx = { width: '100%', my: 2 }

  return (
    <Stack
      flex="1 1 auto"
      width="92%"
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="column">
          <Typography variant="h4">NoVo-Tracker</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Deine (Notfall-)Vorratskammer
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={dividerSx}>Älteste Lebensmittel</Divider>
      <Typography variant="body2" color="text.secondary">
        Keine Lebensmittel vorhanden
      </Typography>
      <Divider sx={dividerSx}>Vorratskammer</Divider>
      < Button variant="text" href="/pantry" color="text.secondary">
        Zur Vorratskammer
      </Button>
    </Stack>
  )
}

export default Home

import React from 'react'
import { useTheme } from '@emotion/react'

import { AppBar, Typography, IconButton, Toolbar } from '@mui/material'

import { useNavigate } from 'react-router-dom'

import { useAppBar } from '../Providers/AppBarProvider'

const CustomAppBar = () => {
  const { config } = useAppBar()
  const navigate = useNavigate()
  const theme = useTheme()
  return (
    <AppBar
      sx={{ background: theme.primary }}
    >
      <Toolbar variant="dense">
        {config.showBackButton && (
          <IconButton
            onClick={() => {
              if (config.backPath === '__back__') {
                navigate(-1)
              } else {
                navigate(config.backPath)
              }
            }}
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ mr: 2 }}
          >
            {config.icon}
          </IconButton>
        )}
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          {config.title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default CustomAppBar

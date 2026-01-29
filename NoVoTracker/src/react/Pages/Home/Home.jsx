import React, { useEffect } from 'react'

import { Stack, Typography, Divider, List } from '@mui/material'
import { Cancel, Check, Settings } from '@mui/icons-material'

import { useAppBar } from '../../Providers/AppBarProvider'


const Home = () => {
  const { setConfig } = useAppBar()
  const { person } = usePerson()

  useEffect(() => {
    setConfig({
      showBackButton: true,
      backPath: '/settings',
      icon: <Settings />,
      title: 'Home'
    })
  }, [])

  const dividerSx = { width: '100%', my: 2 }
  const listSx = { width: '100%' }

  const vaccinationStatus = getVaccinationStatus(person)

  const vaccinationStatusIcon = vaccinationStatus === 'Unvollständig' ? (
    <Cancel fontSize="large" sx={{ color: 'red', pb: '10px' }} />
  ) : (
    <Check fontSize="large" sx={{ color: 'green', pb: '10px' }} />
  )

  return (
    <Stack
      flex="1 1 auto"
      width="92%"
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="column" spacing={1}>
          <Typography variant="h5">{`${person.firstName} ${person.lastName}`}</Typography>
          <Typography>{person.birthdate}</Typography>
        </Stack>
        <Stack direction="column" alignItems="center">
          {vaccinationStatusIcon}
          <Typography variant="h5" fontSize={16}>Impfstatus</Typography>
          <Typography variant="h5" fontSize={14}>{vaccinationStatus}</Typography>
        </Stack>
      </Stack>
      <Divider sx={dividerSx}>Offene Schutzimpfungen</Divider>
      <List sx={listSx}>
        <OpenGeneralVaccList />
      </List>
      <Divider sx={dividerSx}>Offene Reiseimpfungen</Divider>
      <List sx={listSx}>
        <OpenTravelVaccList />
      </List>
    </Stack>
  )
}

export default Home

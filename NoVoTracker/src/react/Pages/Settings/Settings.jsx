import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAppBar } from '../../Providers/AppBarProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSettings, saveSettings } from '../../utils/settingsUtils';

const Settings = () => {
  const { setConfig } = useAppBar();
  const [settings, setSettings] = useState(getSettings());
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    setConfig({
      title: 'Einstellungen',
      showBackButton: true,
      icon: <ArrowBackIcon />,
      backPath: '__back__'
    });
  }, [setConfig]);

  const handlePersonsChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const newSettings = { ...settings, defaultPersons: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !settings.storageLocations.includes(newLocation.trim())) {
      const newSettings = {
        ...settings,
        storageLocations: [...settings.storageLocations, newLocation.trim()]
      };
      setSettings(newSettings);
      saveSettings(newSettings);
      setNewLocation('');
    }
  };

  const handleDeleteLocation = (location) => {
    const newSettings = {
      ...settings,
      storageLocations: settings.storageLocations.filter(loc => loc !== location)
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Haushalt
        </Typography>
        <TextField
          label="Standard Anzahl Personen"
          type="number"
          value={settings.defaultPersons}
          onChange={handlePersonsChange}
          inputProps={{ min: 1, max: 10 }}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Diese Anzahl wird als Standardwert in der Notvorrat-Checkliste verwendet.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Lagerorte
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Verwalten Sie Ihre Lagerorte. Diese werden beim Hinzufügen neuer Artikel angezeigt.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2}}>
          <TextField
            label="Neuer Lagerort"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddLocation();
              }
            }}
            fullWidth
            size="small"
            sx={{ width: '60%' }}
          />
          <Button
            variant="contained"
            onClick={handleAddLocation}
            disabled={!newLocation.trim()}
            sx={{ width: '40%' }}
          >
            Hinzufügen
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List>
          {settings.storageLocations.map((location, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteLocation(location)}
                  disabled={settings.storageLocations.length <= 1}
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1
              }}
            >
              <ListItemText primary={location} />
            </ListItem>
          ))}
        </List>

        {settings.storageLocations.length <= 1 && (
          <Typography variant="caption" color="text.secondary">
            Mindestens ein Lagerort muss vorhanden sein.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Settings;

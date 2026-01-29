import React, { useState, useEffect } from 'react';
import {
  ladeLebensmittel,
  fuegeLebensmittelHinzu,
  aktualisiereLebensmittel,
  loescheLebensmittel,
  exportiereDaten,
  importiereDaten
} from '../../utils/storage';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';

const LebensmittelListe = () => {
  const [lebensmittel, setLebensmittel] = useState([]);
  const [neuName, setNeuName] = useState('');
  const [neuTyp, setNeuTyp] = useState('');
  const [neuMhd, setNeuMhd] = useState('');

  // Lade Daten beim Start
  useEffect(() => {
    ladeDaten();
  }, []);

  const ladeDaten = async () => {
    const daten = await ladeLebensmittel();
    setLebensmittel(daten);
  };

  const handleHinzufuegen = async () => {
    if (!neuName || !neuTyp || !neuMhd) return;

    await fuegeLebensmittelHinzu({
      name: neuName,
      typ: neuTyp,
      mhd: neuMhd
    });

    // Felder zurücksetzen
    setNeuName('');
    setNeuTyp('');
    setNeuMhd('');

    // Liste neu laden
    await ladeDaten();
  };

  const handleLoeschen = async (id) => {
    await loescheLebensmittel(id);
    await ladeDaten();
  };

  const handleExport = async () => {
    const json = await exportiereDaten();
    // Download als Datei
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vorratskammer-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Vorratskammer
      </Typography>

      {/* Eingabefelder */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Name"
          value={neuName}
          onChange={(e) => setNeuName(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="Typ"
          value={neuTyp}
          onChange={(e) => setNeuTyp(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="MHD"
          type="date"
          value={neuMhd}
          onChange={(e) => setNeuMhd(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleHinzufuegen}
          startIcon={<SaveIcon />}
        >
          Hinzufügen
        </Button>
      </Box>

      {/* Liste */}
      <List>
        {lebensmittel.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton onClick={() => handleLoeschen(item.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={item.name}
              secondary={`${item.typ} - MHD: ${item.mhd}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Export Button */}
      <Button onClick={handleExport} sx={{ mt: 2 }}>
        Daten exportieren
      </Button>

      <Typography variant="caption" sx={{ display: 'block', mt: 2 }}>
        Gespeicherte Lebensmittel: {lebensmittel.length}
      </Typography>
    </Box>
  );
};

export default LebensmittelListe;

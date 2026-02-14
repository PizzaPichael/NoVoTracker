import React, { useMemo, useState } from 'react';
import {
  Button,
  TextField,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Save as SaveIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DEFAULT_QUANTITY_UNITS } from '../models/itemSchema';
import { getStorageLocations } from '../utils/settingsUtils';

const EMPTY_FORM = {
  name: '',
  type: '',
  quantity: '',
  quantityUnit: '',
  alertQuantity: '',
  expiry: '',
  location: '',
};

const CreateItemDialog = ({ open, onClose, onSave, mode, item }) => {
  const initialValues = useMemo(() => {
    if (mode === 'update' && item) {
      return {
        name: item.name || '',
        type: item.type || '',
        quantity: item.quantity || '',
        quantityUnit: item.quantityUnit || '',
        alertQuantity: item.amountToAlert || '',
        expiry: item.expiry || '',
        location: item.location || '',
      };
    }
    return EMPTY_FORM;
  }, [mode, item]);

  const [formData, setFormData] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  // Key-Prop auf dem Dialog sorgt für Reset – kein useEffect nötig

  const updateField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    setSubmitted(true);
    if (!formData.name || !formData.quantity || !formData.expiry || !formData.location) return;

    onSave({
      name: formData.name,
      type: formData.type,
      quantity: formData.quantity,
      quantityUnit: formData.quantityUnit,
      amountToAlert: formData.alertQuantity,
      expiry: formData.expiry,
      location: formData.location,
    });

    if (mode === 'create') setFormData(EMPTY_FORM);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Eintrag {mode === 'create' ? 'hinzufügen' : 'bearbeiten'}</span>
        <IconButton onClick={onClose}>
          <ClearIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bitte fülle <strong>alle mit Sternchen markierten</strong> Felder aus.
        </DialogContentText>
        <Box sx={{ mb: 1 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={updateField('name')}
            fullWidth
            required
            error={submitted && !formData.name}
            helperText={submitted && !formData.name ? 'Pflichtfeld' : ''}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Typ"
            value={formData.type}
            onChange={updateField('type')}
            fullWidth
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              label="Menge"
              value={formData.quantity}
              onChange={updateField('quantity')}
              required
              error={submitted && !formData.quantity}
              helperText={submitted && !formData.quantity ? 'Pflichtfeld' : ''}
              sx={{ flex: 3 }}
            />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="quantity-unit-select-label">Einheit</InputLabel>
              <Select
                labelId="quantity-unit-select-label"
                value={formData.quantityUnit}
                onChange={updateField('quantityUnit')}
                label="Einheit"
              >
                {Object.values(DEFAULT_QUANTITY_UNITS).map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              label="Menge für Bestandswarnung"
              value={formData.alertQuantity}
              onChange={updateField('alertQuantity')}
              sx={{ flex: 3 }}
            />
            <Box sx={{ flex: 1 }} />
          </Box>
          <TextField
            label="MHD"
            type="date"
            value={formData.expiry}
            onChange={updateField('expiry')}
            fullWidth
            required
            error={submitted && !formData.expiry}
            helperText={submitted && !formData.expiry ? 'Pflichtfeld' : ''}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }} required error={submitted && !formData.location}>
            <InputLabel id="lagerort-select-label">Lagerort</InputLabel>
            <Select
              labelId="lagerort-select-label"
              value={formData.location}
              onChange={updateField('location')}
              label="Lagerort"
            >
              {getStorageLocations().map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {mode === 'create' ? (
                <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                >
                Hinzufügen
                </Button>
            ) : (
                <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                >
                Speichern
                </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemDialog;
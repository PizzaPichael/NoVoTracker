import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { loadDBItems, updateDBItem, addDBItem } from '../../utils/storage';
import { DEFAULT_QUANTITY_UNITS, DEFAULT_STORAGE_LOCATIONS } from '../../models/itemSchema';

// Notvorrat-Daten basierend auf offizieller Vorratstabelle (für 1 Tag, 1 Person)
// dietType: 'both' = beide Ernährungsformen, 'mixed' = nur Mischkost, 'vegetarian' = nur vegetarisch
const EMERGENCY_SUPPLIES = [
  // Getreideprodukte, Brot, Kartoffeln (identisch für beide)
  { category: 'Getreide & Kartoffeln', name: 'Vollkornbrot', baseAmount: 71, unit: 'g', dietType: 'both' },
  { category: 'Getreide & Kartoffeln', name: 'Zwieback', baseAmount: 18, unit: 'g', dietType: 'both' },
  { category: 'Getreide & Kartoffeln', name: 'Knäckebrot', baseAmount: 71, unit: 'g', dietType: 'both' },
  { category: 'Getreide & Kartoffeln', name: 'Nudeln', baseAmount: 28, unit: 'g', dietType: 'both' },
  { category: 'Getreide & Kartoffeln', name: 'Reis', baseAmount: 18, unit: 'g', dietType: 'both' },
  { category: 'Getreide & Kartoffeln', name: 'Haferflocken', baseAmount: 54, unit: 'g', dietType: 'both' },
  { category: 'Getreide & Kartoffeln', name: 'Kartoffeln (geschält)', baseAmount: 71, unit: 'g', dietType: 'both' },
  
  // Gemüse, Pilze (Mischkost)
  { category: 'Gemüse & Pilze', name: 'Bohnen (Konserve, Abtropfgewicht)', baseAmount: 57, unit: 'g', dietType: 'both' },
  { category: 'Gemüse & Pilze', name: 'Erbsen/Möhren (Konserve, Abtropfgewicht)', baseAmount: 64, unit: 'g', dietType: 'both' },
  { category: 'Gemüse & Pilze', name: 'Rotkohl (Konserve, Abtropfgewicht)', baseAmount: 50, unit: 'g', dietType: 'both' },
  { category: 'Gemüse & Pilze', name: 'Sauerkraut (Konserve, Abtropfgewicht)', baseAmount: 50, unit: 'g', dietType: 'both' },
  { category: 'Gemüse & Pilze', name: 'Mais (Konserve, Abtropfgewicht)', baseAmount: 29, unit: 'g', dietType: 'both' },
  { category: 'Gemüse & Pilze', name: 'Pilze (Konserve, Abtropfgewicht)', baseAmount: 29, unit: 'g', dietType: 'both' },
  { category: 'Gemüse & Pilze', name: 'Zwiebeln', baseAmount: 36, unit: 'g', dietType: 'both' },
  
  // Gemüse, Pilze (zusätzlich vegetarisch)
  { category: 'Gemüse & Pilze', name: 'Spargel (Konserve, Abtropfgewicht)', baseAmount: 29, unit: 'g', dietType: 'vegetarian' },
  { category: 'Gemüse & Pilze', name: 'Saure Gurken (Konserve, Abtropfgewicht)', baseAmount: 29, unit: 'g', dietType: 'vegetarian' },
  { category: 'Gemüse & Pilze', name: 'Rote Bete (Konserve, Abtropfgewicht)', baseAmount: 29, unit: 'g', dietType: 'vegetarian' },
  
  // Obst (identisch für beide)
  { category: 'Obst', name: 'Kirschen (Konserve, Abtropfgewicht)', baseAmount: 40, unit: 'g', dietType: 'both' },
  { category: 'Obst', name: 'Birnen (Konserve, Abtropfgewicht)', baseAmount: 18, unit: 'g', dietType: 'both' },
  { category: 'Obst', name: 'Aprikosen (Konserve, Abtropfgewicht)', baseAmount: 18, unit: 'g', dietType: 'both' },
  { category: 'Obst', name: 'Mandarinen (Konserve, Abtropfgewicht)', baseAmount: 25, unit: 'g', dietType: 'both' },
  { category: 'Obst', name: 'Ananas (Konserve, Abtropfgewicht)', baseAmount: 25, unit: 'g', dietType: 'both' },
  { category: 'Obst', name: 'Rosinen', baseAmount: 14, unit: 'g', dietType: 'both' },
  { category: 'Obst', name: 'Haselnusskerne', baseAmount: 10, unit: 'g', dietType: 'both' },
  { category: 'Obst', name: 'Trockenpflaumen', baseAmount: 25, unit: 'g', dietType: 'both' },
  { category: 'Obst', name: 'Frischobst (Apfel, Birne, etc.)', baseAmount: 71, unit: 'g', dietType: 'vegetarian' },
  
  // Getränke
  { category: 'Getränke', name: 'Mineralwasser', baseAmount: 2, unit: 'l', dietType: 'both' },
  { category: 'Getränke', name: 'Zitronensaft', baseAmount: 0.014, unit: 'l', dietType: 'vegetarian' },
  
  // Milch & Milcherzeugnisse (identisch für beide)
  { category: 'Milch & Käse', name: 'H-Milch', baseAmount: 0.2, unit: 'l', dietType: 'both' },
  { category: 'Milch & Käse', name: 'Hartkäse', baseAmount: 50, unit: 'g', dietType: 'both' },
  
  // Fleisch, Fisch, Eier (nur Mischkost)
  { category: 'Fleisch & Fisch', name: 'Tunfisch (Konserve, Abtropfgewicht)', baseAmount: 16.5, unit: 'g', dietType: 'mixed' },
  { category: 'Fleisch & Fisch', name: 'Corned Beef (Konserve, Abtropfgewicht)', baseAmount: 16, unit: 'g', dietType: 'mixed' },
  { category: 'Fleisch & Fisch', name: 'Leberwurst (Konserve, Abtropfgewicht)', baseAmount: 16, unit: 'g', dietType: 'mixed' },
  { category: 'Fleisch & Fisch', name: 'Dauerwurst (Salami)', baseAmount: 16, unit: 'g', dietType: 'mixed' },
  { category: 'Fleisch & Fisch', name: 'Bockwürstchen (Konserve, Abtropfgewicht)', baseAmount: 16, unit: 'g', dietType: 'mixed' },
  { category: 'Fleisch & Fisch', name: 'Eier', baseAmount: 0.5, unit: 'Stk', dietType: 'mixed' },
  
  // Eier, Ersatzprodukte (nur vegetarisch)
  { category: 'Eier & Ersatzprodukte', name: 'Tofu', baseAmount: 20, unit: 'g', dietType: 'vegetarian' },
  { category: 'Eier & Ersatzprodukte', name: 'Vegetarische Bratlinge', baseAmount: 15, unit: 'g', dietType: 'vegetarian' },
  { category: 'Eier & Ersatzprodukte', name: 'Vegetarische Wurst/Würstchen', baseAmount: 23, unit: 'g', dietType: 'vegetarian' },
  { category: 'Eier & Ersatzprodukte', name: 'Vegetarischer Brotaufstrich', baseAmount: 25, unit: 'g', dietType: 'vegetarian' },
  { category: 'Eier & Ersatzprodukte', name: 'Vegetarische Salami', baseAmount: 20, unit: 'g', dietType: 'vegetarian' },
  { category: 'Eier & Ersatzprodukte', name: 'Eier', baseAmount: 0.5, unit: 'Stk', dietType: 'vegetarian' },
  
  // Fette & Öl (identisch für beide)
  { category: 'Fette & Öl', name: 'Butter/Margarine', baseAmount: 18, unit: 'g', dietType: 'both' },
  { category: 'Fette & Öl', name: 'Speiseöl', baseAmount: 15, unit: 'ml', dietType: 'both' },
];

const EmergencyList = () => {
  const [persons, setPersons] = useState(1);
  const [days, setDays] = useState(1);
  const [dietType, setDietType] = useState('mixed'); // 'mixed' oder 'vegetarian'
  const [inventory, setInventory] = useState([]);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    quantity: 0,
    quantityUnit: 'g',
    expiry: '',
    location: ''
  });

  useEffect(() => {
    const fetchInventory = async () => {
      const items = await loadDBItems();
      setInventory(items);
    };
    fetchInventory();
  }, []);

  // Berechne benötigte Mengen und prüfe Verfügbarkeit
  const suppliesWithStatus = React.useMemo(() => {
    // Filtere Supplies basierend auf Ernährungsform
    const relevantSupplies = EMERGENCY_SUPPLIES.filter(supply => 
      supply.dietType === 'both' || supply.dietType === dietType
    );
    
    return relevantSupplies.map((supply) => {
      // Basismenge ist für 1 Tag, 1 Person
      const perDayAmount = supply.baseAmount;
      const requiredAmount = perDayAmount * days * persons;
      
      // Prüfe ob in Vorrat vorhanden
      const matchingItems = inventory.filter((item) => {
        // Einfache Namensübereinstimmung (kann verbessert werden)
        const itemNameLower = item.name.toLowerCase();
        const supplyNameLower = supply.name.toLowerCase();
        return itemNameLower.includes(supplyNameLower.split(' ')[0]) || 
               supplyNameLower.includes(itemNameLower);
      });

      // Summiere verfügbare Menge
      let availableAmount = 0;
      matchingItems.forEach((item) => {
        // Versuche Einheiten zu matchen
        const itemUnit = item.quantityUnit?.toLowerCase() || '';
        const supplyUnit = supply.unit.toLowerCase();
        
        if (itemUnit === supplyUnit || 
            (itemUnit === 'kg' && supplyUnit === 'g') ||
            (itemUnit === 'g' && supplyUnit === 'kg') ||
            (itemUnit === 'stk' && supplyUnit === 'stk')) {
          
          let amount = parseFloat(item.quantity) || 0;
          
          // Konvertiere Einheiten
          if (itemUnit === 'kg' && supplyUnit === 'g') {
            amount = amount * 1000;
          } else if (itemUnit === 'g' && supplyUnit === 'kg') {
            amount = amount / 1000;
          }
          
          availableAmount += amount;
        }
      });

      const isAvailable = availableAmount >= requiredAmount;

      return {
        ...supply,
        requiredAmount: Math.round(requiredAmount * 10) / 10, // Runde auf 1 Dezimalstelle
        availableAmount: Math.round(availableAmount * 10) / 10,
        isAvailable,
      };
    });
  }, [inventory, persons, days, dietType]);

  // Gruppiere nach Kategorie
  const groupedSupplies = suppliesWithStatus.reduce((acc, supply) => {
    if (!acc[supply.category]) {
      acc[supply.category] = [];
    }
    acc[supply.category].push(supply);
    return acc;
  }, {});

  // Handler für Zeilen-Auswahl
  const handleRowClick = (supply) => {
    setSelectedSupply(supply);
    setDetailDialogOpen(true);
  };

  // Handler für Dialog schließen
  const handleDetailClose = () => {
    setDetailDialogOpen(false);
    setSelectedSupply(null);
  };

  // Handler für Bearbeiten öffnen
  const handleEditOpen = (item) => {
    setEditItem({ ...item });
    setEditDialogOpen(true);
  };

  // Handler für Bearbeiten speichern
  const handleEditSave = async () => {
    try {
      await updateDBItem(editItem.id, editItem);
      const items = await loadDBItems();
      setInventory(items);
      setEditDialogOpen(false);
      setEditItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Handler für Hinzufügen öffnen
  const handleAddOpen = () => {
    setNewItem({
      name: selectedSupply?.name || '',
      type: '',
      quantity: 0,
      quantityUnit: selectedSupply?.unit || 'g',
      expiry: '',
      location: ''
    });
    setAddDialogOpen(true);
  };

  // Handler für Hinzufügen speichern
  const handleAddSave = async () => {
    try {
      await addDBItem(newItem);
      const items = await loadDBItems();
      setInventory(items);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Finde alle passenden Artikel für die ausgewählte Supply
  const matchingItems = selectedSupply ? inventory.filter((item) => {
    const itemNameLower = item.name.toLowerCase();
    const supplyNameLower = selectedSupply.name.toLowerCase();
    return itemNameLower.includes(supplyNameLower.split(' ')[0]) || 
           supplyNameLower.includes(itemNameLower);
  }) : [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header mit Dropdowns */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h5" gutterBottom>
          Notvorrat-Checkliste
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Basierend auf Empfehlungen des Bundesamts für Bevölkerungsschutz (2.200 kcal/Tag).{' '}
          <Link 
            href={
              "https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratstabelle"
            }
            target="_blank" 
            rel="noopener noreferrer"
          >
            Weitere Infos hier.
          </Link>
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControl sx={{ width: 120, maxWidth: 170 }}>
            <InputLabel>Personen</InputLabel>
            <Select
              value={persons}
              onChange={(e) => setPersons(e.target.value)}
              label="Personen im Haushalt"
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'Person' : 'Personen'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: 110, maxWidth: 170 }}>
            <InputLabel>Vorratstage</InputLabel>
            <Select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              label="Anzahl Vorratstage"
            >
              {[...Array(28)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'Tag' : 'Tage'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: 120, maxWidth: 170 }}>
            <InputLabel>Ernährung</InputLabel>
            <Select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              label="Ernährungsform"
            >
              <MenuItem value="mixed">Mischkost</MenuItem>
              <MenuItem value="vegetarian">Vegetarisch</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Tabelle */}
      <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
        <TableContainer
          component={Paper}
          sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
        >
          <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '30%' }}><strong>Lebensmittel</strong></TableCell>
                <TableCell align="right" sx={{ width: '25%' }}><strong>Benötigt</strong></TableCell>
                <TableCell align="right" sx={{ width: '25%' }}><strong>Vorhanden</strong></TableCell>
                <TableCell align="center" sx={{ width: '20%' }}><strong>Vorrätig</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedSupplies).map(([category, supplies]) => (
                <React.Fragment key={category}>
                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    <TableCell colSpan={4}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {category}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {supplies.map((supply, idx) => (
                    <TableRow 
                      key={`${category}-${idx}`}
                      onClick={() => handleRowClick(supply)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{supply.name}</TableCell>
                      <TableCell align="right">
                        {supply.requiredAmount} {supply.unit}
                      </TableCell>
                      <TableCell align="right">
                        {supply.availableAmount} {supply.unit}
                      </TableCell>
                      <TableCell align="center">
                        {supply.isAvailable ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Detail Dialog - Zeigt passende Artikel */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={handleDetailClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedSupply?.name}
        </DialogTitle>
        <DialogContent>
          {matchingItems.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              Keine Lebensmittel dieser Art vorhanden
            </Typography>
          ) : (
            <List>
              {matchingItems.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleEditOpen(item)}>
                      <EditIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Menge: {item.quantity} {item.quantityUnit}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          MHD: {item.expiry ? new Date(item.expiry).toLocaleDateString('de-DE') : 'Nicht angegeben'}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddOpen}
            sx={{ mt: 2 }}
          >
            Hinzufügen
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose}>Schließen</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog - Bearbeite Artikel */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Artikel bearbeiten</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={editItem?.name || ''}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Typ"
              value={editItem?.type || ''}
              onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Menge"
                type="number"
                value={editItem?.quantity || 0}
                onChange={(e) => setEditItem({ ...editItem, quantity: parseFloat(e.target.value) })}
                sx={{ flex: 3 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Einheit</InputLabel>
                <Select
                  value={editItem?.quantityUnit || ''}
                  onChange={(e) => setEditItem({ ...editItem, quantityUnit: e.target.value })}
                  label="Einheit"
                >
                  {Object.values(DEFAULT_QUANTITY_UNITS).map((unit) => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="MHD"
              type="date"
              value={editItem?.expiry || ''}
              onChange={(e) => setEditItem({ ...editItem, expiry: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Lagerort</InputLabel>
              <Select
                value={editItem?.location || ''}
                onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                label="Lagerort"
              >
                {Object.values(DEFAULT_STORAGE_LOCATIONS).map((loc) => (
                  <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleEditSave} variant="contained">Speichern</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog - Neuen Artikel hinzufügen */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Artikel hinzufügen</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Typ"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Menge"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                sx={{ flex: 3 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Einheit</InputLabel>
                <Select
                  value={newItem.quantityUnit}
                  onChange={(e) => setNewItem({ ...newItem, quantityUnit: e.target.value })}
                  label="Einheit"
                >
                  {Object.values(DEFAULT_QUANTITY_UNITS).map((unit) => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="MHD"
              type="date"
              value={newItem.expiry}
              onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Lagerort</InputLabel>
              <Select
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                label="Lagerort"
              >
                {Object.values(DEFAULT_STORAGE_LOCATIONS).map((loc) => (
                  <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleAddSave} variant="contained">Hinzufügen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyList;

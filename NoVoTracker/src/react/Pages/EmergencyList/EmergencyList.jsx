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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { loadDBItems } from '../../utils/storage';

// Notvorrat-Daten basierend auf offizieller Vorratstabelle (für 10 Tage, 1 Person)
const EMERGENCY_SUPPLIES = [
  // Getreideprodukte, Brot, Kartoffeln
  { category: 'Getreide & Kartoffeln', name: 'Vollkornbrot', baseAmount: 710, unit: 'g' },
  { category: 'Getreide & Kartoffeln', name: 'Zwieback', baseAmount: 180, unit: 'g' },
  { category: 'Getreide & Kartoffeln', name: 'Knäckebrot', baseAmount: 710, unit: 'g' },
  { category: 'Getreide & Kartoffeln', name: 'Nudeln', baseAmount: 280, unit: 'g' },
  { category: 'Getreide & Kartoffeln', name: 'Reis', baseAmount: 180, unit: 'g' },
  { category: 'Getreide & Kartoffeln', name: 'Haferflocken', baseAmount: 540, unit: 'g' },
  { category: 'Getreide & Kartoffeln', name: 'Kartoffeln', baseAmount: 710, unit: 'g' },
  
  // Gemüse, Pilze
  { category: 'Gemüse & Pilze', name: 'Bohnen (Konserve)', baseAmount: 570, unit: 'g' },
  { category: 'Gemüse & Pilze', name: 'Erbsen/Möhren (Konserve)', baseAmount: 640, unit: 'g' },
  { category: 'Gemüse & Pilze', name: 'Rotkohl (Konserve)', baseAmount: 500, unit: 'g' },
  { category: 'Gemüse & Pilze', name: 'Sauerkraut (Konserve)', baseAmount: 500, unit: 'g' },
  { category: 'Gemüse & Pilze', name: 'Mais (Konserve)', baseAmount: 290, unit: 'g' },
  { category: 'Gemüse & Pilze', name: 'Pilze (Konserve)', baseAmount: 290, unit: 'g' },
  { category: 'Gemüse & Pilze', name: 'Zwiebeln', baseAmount: 360, unit: 'g' },
  
  // Obst
  { category: 'Obst', name: 'Kirschen (Konserve)', baseAmount: 400, unit: 'g' },
  { category: 'Obst', name: 'Birnen (Konserve)', baseAmount: 180, unit: 'g' },
  { category: 'Obst', name: 'Aprikosen (Konserve)', baseAmount: 180, unit: 'g' },
  { category: 'Obst', name: 'Mandarinen (Konserve)', baseAmount: 250, unit: 'g' },
  { category: 'Obst', name: 'Ananas (Konserve)', baseAmount: 250, unit: 'g' },
  { category: 'Obst', name: 'Rosinen', baseAmount: 140, unit: 'g' },
  { category: 'Obst', name: 'Haselnusskerne', baseAmount: 100, unit: 'g' },
  { category: 'Obst', name: 'Trockenpflaumen', baseAmount: 250, unit: 'g' },
  
  // Getränke
  { category: 'Getränke', name: 'Mineralwasser', baseAmount: 20, unit: 'l' },
  
  // Milch & Milcherzeugnisse
  { category: 'Milch & Käse', name: 'H-Milch', baseAmount: 2, unit: 'l' },
  { category: 'Milch & Käse', name: 'Hartkäse', baseAmount: 500, unit: 'g' },
  
  // Fleisch, Fisch, Eier
  { category: 'Fleisch & Fisch', name: 'Tunfisch (Konserve)', baseAmount: 165, unit: 'g' },
  { category: 'Fleisch & Fisch', name: 'Corned Beef (Konserve)', baseAmount: 160, unit: 'g' },
  { category: 'Fleisch & Fisch', name: 'Leberwurst (Konserve)', baseAmount: 160, unit: 'g' },
  { category: 'Fleisch & Fisch', name: 'Dauerwurst (Salami)', baseAmount: 160, unit: 'g' },
  { category: 'Fleisch & Fisch', name: 'Bockwürstchen (Konserve)', baseAmount: 160, unit: 'g' },
  { category: 'Fleisch & Fisch', name: 'Eier', baseAmount: 5, unit: 'Stk' },
  
  // Fette & Öl
  { category: 'Fette & Öl', name: 'Butter/Margarine', baseAmount: 180, unit: 'g' },
  { category: 'Fette & Öl', name: 'Speiseöl', baseAmount: 150, unit: 'ml' },
];

const EmergencyList = () => {
  const [persons, setPersons] = useState(1);
  const [days, setDays] = useState(10);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const items = await loadDBItems();
      setInventory(items);
    };
    fetchInventory();
  }, []);

  // Berechne benötigte Mengen und prüfe Verfügbarkeit
  const suppliesWithStatus = React.useMemo(() => {
    return EMERGENCY_SUPPLIES.map((supply) => {
      // Basismenge ist für 10 Tage, also pro Tag = baseAmount / 10
      const perDayAmount = supply.baseAmount / 10;
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
  }, [inventory, persons, days]);

  // Gruppiere nach Kategorie
  const groupedSupplies = suppliesWithStatus.reduce((acc, supply) => {
    if (!acc[supply.category]) {
      acc[supply.category] = [];
    }
    acc[supply.category].push(supply);
    return acc;
  }, {});

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
          Basierend auf Empfehlungen des Bundesamts für Bevölkerungsschutz (2.200 kcal/Tag)
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ width: 170, maxWidth: 170 }}>
            <InputLabel>Personen im Haushalt</InputLabel>
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

          <FormControl sx={{ width: 170,maxWidth: 170 }}>
            <InputLabel>Anzahl Vorratstage</InputLabel>
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
                    <TableRow key={`${category}-${idx}`}>
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
    </Box>
  );
};

export default EmergencyList;

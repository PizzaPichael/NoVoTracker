import React, { useState, useEffect } from 'react';
import {
  loadItems,
  addItem,
  updateItem,
  deleteItem,
  exportData,
  importData
} from '../../utils/storage';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon, Settings } from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ClearIcon from '@mui/icons-material/Clear';

import { DataGrid } from '@mui/x-data-grid';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { PANTRY_COLUMNS } from '../../models/pantryColumns';
import { useAppBar } from '../../Providers/AppBarProvider'


const Pantry = () => {
  const { setConfig } = useAppBar()


  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');
  const [newQuantity, setNewQuantity] = useState(null);
  const [newExpiry, setNewExpiry] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const [openCreateDialogue, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setConfig({
      showBackButton: true,
      backPath: '/',
      icon: <ArrowBackIosIcon />,
      title: 'NoVo-Tracker'
    })
  }, [setConfig]);

  const loadData = async () => {
    const data = await loadItems();
    console.log('Geladene Daten:', data);  // Debug-Log

    setItems(data);
  };

  const handleAdd = async () => {
    if (!newName || !newType || !newQuantity || !newExpiry || !newLocation) return;

    await addItem({
      name: newName,
      type: newType,
      quantity: newQuantity,
      expiry: newExpiry,
      location: newLocation
    });

    setNewName('');
    setNewType('');
    setNewQuantity(null);
    setNewExpiry('');
    setNewLocation('');

    await loadData();
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    await loadData();
  };

  const handleExport = async () => {
    const json = await exportData();
    const bianryLargeObject = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(bianryLargeObject);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pantry-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const rows = [];
  console.log('items ', items);
  items.forEach((item) => {
    const rowObj = {
      id: item.id,
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      expiry: item.expiry,
      location: item.location
    };
    rows.push(rowObj);
  })

  const dataGridColumns = [];
  PANTRY_COLUMNS.forEach((column) => {
    const columnObj = {
      field: column.key,
      headerName: column.label
    }
    dataGridColumns.push(columnObj);
  })

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Vorratskammer
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {PANTRY_COLUMNS.map(field => (
                <TableCell
                  key={field.key}
                  align="right"
                >{field.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id + row.name}
              >
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.expiry}</TableCell>
                <TableCell align="right">{row.location}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { handleDelete(row.id) }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box>
        <DataGrid rows={rows} columns={dataGridColumns}></DataGrid>
      </Box>

      <Box>
        <Button variant="outlined" onClick={handleClickOpen} sx={{ mt: 1 }}>
          Eintrag hinzufügen
        </Button>
        <Dialog open={openCreateDialogue} onClose={handleClose}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Subscribe</span>
            <IconButton onClick={handleClose}>
              <ClearIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>

            <DialogContentText>
              To subscribe to this website, please enter your email address here. We
              will send updates occasionally.
            </DialogContentText>
            <Box sx={{ mb: 1 }}>
              <TextField
                label="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Typ"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Menge"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="MHD"
                type="date"
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 1 }}
              />
              <TextField
                label="Lagerort"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleAdd}
                  startIcon={<SaveIcon />}
                >
                  Hinzufügen
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
      <Box>
        <Button onClick={handleExport} sx={{ mt: 2 }}>
          Daten exportieren
        </Button>
      </Box>


      <Typography variant="caption" sx={{ display: 'block', mt: 2 }}>
        Gespeicherte Lebensmittel: {items.length}
      </Typography>
    </Box>
  );
};

export default Pantry;

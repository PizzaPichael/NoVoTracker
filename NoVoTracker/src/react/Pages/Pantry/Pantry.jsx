import React, { useState, useEffect } from 'react';
import { loadDBItems, addDBItem } from '../../utils/storage';
import {
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Settings,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { ITEM_SCHEMA } from '../../models/itemSchema';
import { useAppBar } from '../../Providers/AppBarProvider';
import { StyledMenu } from '../../Components/StyledMenu';

import { insertTestData } from '../../../../scripts/insertTestData';

const keysToExcludeFromTable = ['created', 'id', 'qunatity', 'type', 'expiry'];
const TABLE_COLUMNS = ITEM_SCHEMA.filter(
  (col) => !keysToExcludeFromTable.includes(col.key),
);

const Pantry = () => {
  const { setConfig } = useAppBar();

  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');
  const [newQuantity, setNewQuantity] = useState(null);
  const [newExpiry, setNewExpiry] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const [openCreateDialogue, setOpen] = React.useState(false);

  const [menuListAnchorEl, setMenuListAnchorEl] = React.useState(null);
  const menuListOpen = Boolean(menuListAnchorEl);

  const [checkboxSelectionEnabled, setCheckboxSelectionEnabled] =
    React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleMenuListClick = (event) => {
    setMenuListAnchorEl(event.currentTarget);
  };
  const handleMenuListClose = () => {
    setMenuListAnchorEl(null);
  };

  const handleToggleCheckboxSelection = () => {
    setCheckboxSelectionEnabled(!checkboxSelectionEnabled);
    handleMenuListClose();
  };

  const handleCreateDialogueClick = () => {
    setOpen(true);
  };

  const handleCreateDialogueClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setConfig({
      showBackButton: true,
      backPath: '/',
      icon: <ArrowBackIosIcon />,
      title: 'NoVo-Tracker',
    });
  }, [setConfig]);

  // TODO: Remove this after testing - inserts test data
  useEffect(() => {
    insertTestData();
  }, []);

  const loadData = async () => {
    const data = await loadDBItems();
    console.log('Geladene Daten:', data); // Debug-Log

    setItems(data);
  };

  const handleAdd = async () => {
    if (!newName || !newType || !newQuantity || !newExpiry || !newLocation)
      return;

    await addDBItem({
      name: newName,
      type: newType,
      quantity: newQuantity,
      expiry: newExpiry,
      location: newLocation,
    });

    setNewName('');
    setNewType('');
    setNewQuantity('');
    setNewExpiry('');
    setNewLocation('');

    await loadData();
  };

  // TODO
  const handleDelete = async (id) => {
    return null;
  };

  // TODO
  const handleExport = async () => {
    return null;
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(items.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <Box
      id="pantry-content"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%', // Nutzt die verfügbare Höhe vom AppLayout
        overflow: 'hidden',
      }}
    >
      {/* ---Header and more-menu--- */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
          flexShrink: 0, // Header soll nicht schrumpfen
        }}
      >
        <Typography variant="h4">Vorratskammer</Typography>
        <IconButton
          id="MenuListButton"
          onClick={handleMenuListClick}
          aria-controls={menuListOpen ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuListOpen ? 'true' : undefined}
        >
          <MoreVertIcon />
        </IconButton>
        <StyledMenu
          id="demo-customized-menu"
          slotProps={{
            list: {
              'aria-labelledby': 'demo-customized-button',
            },
          }}
          anchorEl={menuListAnchorEl}
          open={menuListOpen}
          onClose={handleMenuListClose}
        >
          <MenuItem onClick={handleToggleCheckboxSelection} disableRipple>
            <CheckBoxIcon />
            {checkboxSelectionEnabled
              ? 'Auswahl deaktivieren'
              : 'Einträge auswählen'}
          </MenuItem>
          <MenuItem onClick={handleMenuListClose} disableRipple>
            <DeleteIcon />
            Einträge löschen
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleExport();
              handleMenuListClose();
            }}
            disableRipple
          >
            <ExportIcon />
            Daten exportieren
          </MenuItem>
        </StyledMenu>
      </Box>

      {/* ---Table--- */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          minHeight: 0,
          mb: 1,
          overflow: 'auto',
        }}
      >
        <TableContainer
          component={Paper}
          sx={{ height: '100%', maxWidth: '100%' }}
        >
          <Table stickyHeader sx={{ width: '100%', tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                {checkboxSelectionEnabled && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selectedRows.length === items.length && items.length > 0
                      }
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < items.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                {TABLE_COLUMNS.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <strong>{column.label}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  selected={selectedRows.includes(item.id)}
                  sx={{
                    cursor: checkboxSelectionEnabled ? 'pointer' : 'default',
                  }}
                  onClick={() =>
                    checkboxSelectionEnabled && handleSelectRow(item.id)
                  }
                >
                  {checkboxSelectionEnabled && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedRows.includes(item.id)} />
                    </TableCell>
                  )}
                  {TABLE_COLUMNS.map((column) => (
                    <TableCell
                      key={column.key}
                      sx={{
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* AddEntry Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0, // Button soll nicht schrumpfen
          pb: 0,
        }}
      >
        <Button variant="outlined" onClick={handleCreateDialogueClick}>
          Eintrag hinzufügen
        </Button>
        <Dialog open={openCreateDialogue} onClose={handleCreateDialogueClose}>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Eintrag hinzufügen</span>
            <IconButton onClick={handleCreateDialogueClose}>
              <ClearIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bitte fülle <strong>alle</strong> unten stehenden Felder aus um
              einen neuen Eintrag zu erstellen.
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
    </Box>
  );
};

export default Pantry;

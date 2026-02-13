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
  TableSortLabel,
  Paper,
  Checkbox,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';

import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Settings,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { visuallyHidden } from '@mui/utils';

import { ITEM_SCHEMA, DEFAULT_STORAGE_LOCATIONS } from '../../models/itemSchema';
import { StyledMenu } from '../../Components/StyledMenu';

import { insertTestData } from '../../../../scripts/insertTestData';

const keysToExcludeFromTable = ['created', 'id', 'qunatity', 'type', 'expiry'];
const TABLE_COLUMNS = ITEM_SCHEMA.filter(
  (col) => !keysToExcludeFromTable.includes(col.key),
);

// Sortier-Funktionen nach MUI-Muster
function descendingComparator(a, b, orderBy) {
  // Null/Undefined Behandlung
  if (b[orderBy] == null) return -1;
  if (a[orderBy] == null) return 1;
  
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Row-Komponente mit Collapse-Funktionalität
function Row(props) {
  const { 
    item, 
    checkboxSelectionEnabled, 
    isSelected, 
    onSelectRow 
  } = props;
  const [open, setOpen] = React.useState(false);

  const handleRowClick = () => {
    if (checkboxSelectionEnabled) {
      onSelectRow(item.id);
    } else {
      setOpen(!open);
    }
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        selected={isSelected}
        sx={{
          '& > *': { borderBottom: 'unset' },
          cursor: 'pointer',
        }}
        onClick={handleRowClick}
      >
        {checkboxSelectionEnabled && (
          <TableCell padding="checkbox">
            <Checkbox checked={isSelected} />
          </TableCell>
        )}
        {TABLE_COLUMNS.map((column) => (
          <TableCell
            key={column.key}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              py: 1,
              px: 1,
              ...(column.key === 'quantity' && { width: '60px', maxWidth: '80px' }),
              ...(column.key === 'daysUntilExpired' && { width: '85px', maxWidth: '85px' }),
            }}
          >
            {item[column.key]}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={checkboxSelectionEnabled ? TABLE_COLUMNS.length + 1 : TABLE_COLUMNS.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Typ:</Typography>
                <Typography variant="body2">{item.type || '-'}</Typography>
                
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>MHD:</Typography>
                <Typography variant="body2">{item.expiry || '-'}</Typography>
                
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Erstellt am:</Typography>
                <Typography variant="body2">{item.created || '-'}</Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// EnhancedTableHead Komponente
function EnhancedTableHead(props) {
  const { 
    onSelectAllClick, 
    order, 
    orderBy, 
    numSelected, 
    rowCount, 
    onRequestSort,
    checkboxSelectionEnabled,
    filters,
    onFilterChange,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {checkboxSelectionEnabled && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'alle Einträge auswählen',
              }}
            />
          </TableCell>
        )}
        {TABLE_COLUMNS.map((column) => (
          <TableCell
            key={column.key}
            sx={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              verticalAlign: 'bottom', // Labels am unteren Rand ausrichten
              ...(column.key === 'quantity' && { width: '80px', maxWidth: '80px' }),
              ...(column.key === 'daysUntilExpired' && { width: '85px', maxWidth: '85px' }),
            }}
          >
            <TableSortLabel
              active={orderBy === column.key}
              direction={orderBy === column.key ? order : 'asc'}
              onClick={createSortHandler(column.key)}
            >
              <strong>{column.label}</strong>
              {orderBy === column.key ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'absteigend sortiert' : 'aufsteigend sortiert'}
                </Box>
              ) : null}
            </TableSortLabel>
            <TextField
              size="small"
              placeholder="Filter..."
              value={filters[column.key] || ''}
              onChange={(e) => onFilterChange(column.key, e.target.value)}
              onClick={(e) => e.stopPropagation()} // Verhindert Sortierung beim Klick auf Filter
              sx={{ mt: 0.5, width: '100%' }}
              inputProps={{ style: { fontSize: '0.875rem' } }}
            />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Pantry = () => {
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

  // Sortierung und Filter
  const [orderBy, setOrderBy] = React.useState('name');
  const [order, setOrder] = React.useState('asc');
  const [filters, setFilters] = React.useState({});
  
  // Lagerort-Filter (alle Lagerorte sind standardmäßig ausgewählt)
  const allLocations = Object.values(DEFAULT_STORAGE_LOCATIONS);
  const [selectedLocations, setSelectedLocations] = React.useState(allLocations);

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

  // AppBar config wird jetzt von AppLayout basierend auf Route gesetzt

  // TODO: Remove this after testing - inserts test data
  useEffect(() => {
    insertTestData();
  }, []);

  const loadData = async () => {
    const data = await loadDBItems();
    console.log('Geladene Daten:', data); // Debug-Log

    setItems(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, []);


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
  // eslint-disable-next-line no-unused-vars
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
      const visibleIds = visibleRows.map((item) => item.id);
      setSelectedRows(visibleIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Sortierung nach MUI-Muster
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filter
  const handleFilterChange = (columnKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
  };

  // Gefilterte und sortierte Items (React Compiler optimiert automatisch)
  let visibleRows = [...items];
  
  // Nach Lagerort filtern
  if (selectedLocations.length > 0 && selectedLocations.length < allLocations.length) {
    visibleRows = visibleRows.filter((item) =>
      selectedLocations.includes(item.location)
    );
  }
  
  // Nach Spalten filtern
  Object.keys(filters).forEach((key) => {
    const filterValue = filters[key];
    if (filterValue) {
      visibleRows = visibleRows.filter((item) =>
        String(item[key]).toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  });

  // Sortieren mit MUI Comparator
  if (orderBy) {
    visibleRows.sort(getComparator(order, orderBy));
  }

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
        <FormControl sx={{ minWidth: 250 }} size="small">
          <Select
            multiple
            displayEmpty
            value={selectedLocations}
            onChange={(e) => setSelectedLocations(e.target.value)}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return "Angezeigte Lagerorte: Keine";
              }
              if (selected.length === allLocations.length) {
                return "Angezeigte Lagerorte: Alle";
              }
              if (selected.length === 1) {
                return `Angezeigte Lagerorte: ${selected[0]}`;
              }
              return "Angezeigte Lagerorte: Mehrere";
            }}
            sx={{
              '& .MuiSelect-select': {
                py: 1,
              }
            }}
          >
            {allLocations.map((location) => (
              <MenuItem key={location} value={location}>
                <Checkbox checked={selectedLocations.indexOf(location) > -1} />
                <Typography>{location}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        }}
      >
        <TableContainer
          component={Paper}
          sx={{ 
            height: '100%', 
            width: '100%', 
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Table 
            stickyHeader 
            size="small" 
            sx={{ width: '100%', tableLayout: 'fixed' }}
          >
            <EnhancedTableHead
              numSelected={selectedRows.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAll}
              onRequestSort={handleRequestSort}
              rowCount={visibleRows.length}
              checkboxSelectionEnabled={checkboxSelectionEnabled}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <TableBody>
              {visibleRows.map((item) => (
                <Row
                  key={item.id}
                  item={item}
                  checkboxSelectionEnabled={checkboxSelectionEnabled}
                  isSelected={selectedRows.includes(item.id)}
                  onSelectRow={handleSelectRow}
                />
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

import React, { useEffect, useState } from 'react'

import { 
  Stack, 
  Typography, 
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
} from '@mui/material'

import { loadDBItems } from '../../utils/storage'
import { ITEM_SCHEMA } from '../../models/itemSchema'

// Table configuration - same as Pantry
const keysToExcludeFromTable = ['created', 'id', 'qunatity', 'type', 'expiry'];
const TABLE_COLUMNS = ITEM_SCHEMA.filter(
  (col) => !keysToExcludeFromTable.includes(col.key),
);

// Row component with collapse functionality
function Row(props) {
  const { item } = props;
  const [open, setOpen] = React.useState(false);

  const handleRowClick = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        sx={{
          '& > *': { borderBottom: 'unset' },
          cursor: 'pointer',
        }}
        onClick={handleRowClick}
      >
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={TABLE_COLUMNS.length}>
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



const Home = () => {
  const [itemsByExpiry, setItemsByExpiry] = useState([]);
  const [itemsByQuantity, setItemsByQuantity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadDBItems();
      
      // Sort by daysUntilExpired ascending (soonest expiration first)
      const sortedByExpiry = [...data].sort((a, b) => {
        // Handle null/undefined values
        if (a.daysUntilExpired == null) return 1;
        if (b.daysUntilExpired == null) return -1;
        return a.daysUntilExpired - b.daysUntilExpired;
      });
      setItemsByExpiry(sortedByExpiry);
      
      // Sort by quantity ascending (lowest quantity first)
      const sortedByQuantity = [...data].sort((a, b) => {
        // Handle null/undefined values
        if (a.quantity == null) return 1;
        if (b.quantity == null) return -1;
        return a.quantity - b.quantity;
      });
      setItemsByQuantity(sortedByQuantity);
    };
    fetchData();
  }, []);

  const dividerSx = { width: '100%', my: 2 }

  return (
    <Stack
      flex="1 1 auto"
      width="92%"
      sx={{ height: '100%' }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="column">
          <Typography variant="h4">NoVo-Tracker</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Deine (Notfall-)Vorratskammer
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={dividerSx}>Älteste Lebensmittel</Divider>
      
      {/* Table Container - Takes up half the page */}
      <Box sx={{ height: '45%', minHeight: 0, mb: 2 }}>
        {itemsByExpiry.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Keine Lebensmittel vorhanden
          </Typography>
        ) : (
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
              <TableHead>
                <TableRow>
                  {TABLE_COLUMNS.map((column) => (
                    <TableCell
                      key={column.key}
                      sx={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        ...(column.key === 'quantity' && { width: '80px', maxWidth: '80px' }),
                        ...(column.key === 'daysUntilExpired' && { width: '85px', maxWidth: '85px' }),
                      }}
                    >
                      <strong>{column.label}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsByExpiry.map((item) => (
                  <Row key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Divider sx={dividerSx}>Niedrige Bestände</Divider>
      
      {/* Second Table - Items sorted by quantity */}
      <Box sx={{ height: '45%', minHeight: 0, mb: 2 }}>
        {itemsByQuantity.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Keine Lebensmittel vorhanden
          </Typography>
        ) : (
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
              <TableHead>
                <TableRow>
                  {TABLE_COLUMNS.map((column) => (
                    <TableCell
                      key={column.key}
                      sx={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        ...(column.key === 'quantity' && { width: '80px', maxWidth: '80px' }),
                        ...(column.key === 'daysUntilExpired' && { width: '85px', maxWidth: '85px' }),
                      }}
                    >
                      <strong>{column.label}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsByQuantity.map((item) => (
                  <Row key={`qty-${item.id}`} item={item} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Stack>
  )
}

export default Home

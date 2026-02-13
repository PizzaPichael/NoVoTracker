import React from 'react';
import { Button } from '@mui/material';
import { loadDBItems, deleteAllDBItems } from '../utils/storage';
import { insertTestData } from '../../../scripts/insertTestData';
  

const Test = () => {

    const handleLoadItems = async () => {
        try {
            const items = await loadDBItems();
            console.log('Loaded items:', items);
        } catch (err) {
            console.error('Error loading items:', err);
        }
    };

    const handleDeleteAllItems = async () => {
        try {
            await deleteAllDBItems();
            console.log('All items deleted successfully');
            alert('Alle Datenbankeinträge wurden gelöscht');
        } catch (err) {
            console.error('Error deleting all items:', err);
            alert('Fehler beim Löschen: ' + err.message);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <Button variant="contained" onClick={handleLoadItems}>
                Load DB Items
            </Button>
            <Button variant="contained" onClick={() => insertTestData()}>
                Insert Testdata
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteAllItems}>
                Alle Einträge löschen
            </Button>
        </div>
    );
};

export default Test;

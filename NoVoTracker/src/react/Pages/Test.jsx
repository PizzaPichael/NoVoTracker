import React from 'react';
import { Button } from '@mui/material';
import { loadDBItems } from '../utils/storage';
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

    return (
        <div style={{ padding: 16 }}>
            <Button variant="contained" onClick={handleLoadItems}>
                Load DB Items
            </Button>
            <Button variant="contained" onClick={() => insertTestData()}>
                Insert Testdata
            </Button>
        </div>
    );
};

export default Test;

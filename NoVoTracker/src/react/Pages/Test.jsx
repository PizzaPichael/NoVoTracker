import React, { useEffect } from 'react';
import { useAppBar } from '../Providers/AppBarProvider';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button } from '@mui/material';
import { loadDBItems } from '../utils/storage';
import { insertTestData } from '../../../scripts/insertTestData';
  

const Test = () => {
    const { setConfig } = useAppBar();

    useEffect(() => {
    setConfig({
      showBackButton: true,
      backPath: '/',
      icon: <ArrowBackIosIcon />,
      title: 'NoVo-Tracker',
    });
  }, [setConfig]);

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

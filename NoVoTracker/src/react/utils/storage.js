import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { ITEM_SCHEMA } from '../models/itemSchema';

const sqliteConnection = new SQLiteConnection(CapacitorSQLite);
const DB_NAME = 'novotracker.db';

let dbInstance = null;
let dbInitPromise = null;

/**
 * Wartet bis DB initialisiert ist
 */
const waitForDB = async () => {
    if (dbInstance) return dbInstance;
    if (dbInitPromise) return await dbInitPromise;
    
    // Wenn weder dbInstance noch Promise existiert, warte kurz und versuche erneut
    await new Promise(resolve => setTimeout(resolve, 100));
    return await waitForDB();
};

/**
 * Berechnet die Tage bis zum Ablaufdatum
 * 
 * @param {*} expiry 
 * @returns Anzahl Tage bis zum Ablauf oder null, wenn kein Datum angegeben
 */
const calculateDaysUntilExpired = (expiry) => {
    if (!expiry) return null;
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Initialisiert die Datenbank
 */
export const initDB = async () => {
    // Verhindere mehrfache gleichzeitige Initialisierung
    if (dbInitPromise) return await dbInitPromise;
    
    dbInitPromise = (async () => {
        try {
            // Prüfen ob DB bereits initialisiert ist
            const ret = await sqliteConnection.checkConnectionsConsistency();
            const isConn = (await sqliteConnection.isConnection(DB_NAME)).result;
            
            let db;
            if (ret.result && isConn) {
                db = await sqliteConnection.retrieveConnection(DB_NAME);
            } else {
                db = await sqliteConnection.createConnection(
                    DB_NAME, 
                    false, 
                    'no-encryption', 
                    1,
                    false
                );
            }
            
            await db.open();
            
            const columns = ITEM_SCHEMA.map(col => `${col.key} ${col.dbType}`).join(', ');
            const query = `CREATE TABLE IF NOT EXISTS items (${columns})`;
            
            console.log('Creating table...');
            await db.execute(query);
            
            dbInstance = db;
            console.log('Database initialized successfully');
            return db;
        } catch (error) {
            console.error('Error initializing database:', error);
            dbInitPromise = null; // Reset bei Fehler
            throw error;
        }
    })();
    
    return await dbInitPromise;
};

export const loadDBItems = async () => {
    const db = await waitForDB();
    
    const query = 'SELECT * FROM items';
    const result = await db.query(query);
    console.log('Loaded items from DB:', result);
    return result.values || [];
};

export const addDBItem = async (item) => {
    const db = await waitForDB();
    
    // Nur die relevanten Spalten (ohne id und created)
    const columns = ['name', 'type', 'quantity', 'expiry', 'daysUntilExpired', 'location'];
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO items (${columns.join(', ')}) VALUES (${placeholders})`;
    
    const values = [
        item.name,
        item.type,
        item.quantity || 0,
        item.expiry || null,
        calculateDaysUntilExpired(item.expiry) || null,
        item.location || null
    ];
    
    const result = await db.run(query, values);
    // console.log('Item inserted:', result);
    return result;
};

export const updateDBItem = async (id, updates) => {
    const db = await waitForDB();
    
    // Nur erlaubte Spalten (keine id oder created Updates)
    const allowedColumns = ['name', 'type', 'quantity', 'expiry', 'daysUntilExpired', 'location'];
    
    // Filtere nur die Spalten, die im updates-Objekt vorhanden sind
    const columns = Object.keys(updates).filter(key => allowedColumns.includes(key));
    
    if (columns.length === 0) {
        throw new Error('No valid columns to update');
    }
    
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const query = `UPDATE items SET ${setClause} WHERE id = ?`;

    if (updates.expiry) {
        updates.daysUntilExpired = calculateDaysUntilExpired(updates.expiry);
    }

    const values = [...columns.map(col => updates[col]), id];
    
    const result = await db.run(query, values);
    console.log('Item updated:', result);
    return result;
};

export const deleteDBItem = async (id) => {
    const db = await waitForDB();
    
    const query = 'DELETE FROM items WHERE id = ?';
    const result = await db.run(query, [id]);
    console.log('Item deleted:', result);
    return result;
};

// Platzhalter-Funktionen (noch nicht implementiert)
const throwNotImplemented = () => {
    throw new Error('Diese Funktion ist noch nicht implementiert');
};

export const exportData = async () => {
    throwNotImplemented();
};

export const importData = async () => {
    throwNotImplemented();
};

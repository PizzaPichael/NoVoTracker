/**
 * Central schema definition for items
 * Single source of truth for both database schema and UI configuration
 */

export const DEFAULT_STORAGE_LOCATIONS = {
    FRIDGE: 'Kühlschrank',
    FREEZER: 'Gefrierschrank',
    PANTRY: 'Vorratsschrank',
    CELLAR: 'Keller'
};

export const DEFAULT_QUANTITY_UNITS = {
    // Gewicht
    GRAM: 'g',
    KILOGRAM: 'kg',
    MILLIGRAM: 'mg',
    // Volumen
    LITER: 'l',
    MILLILITER: 'ml',
    // Stück
    PIECE: 'Stk.',
    // Packungen
    PACKAGE: 'Pkg.',
    CAN: 'Dose',
    JAR: 'Glas',
    BOTTLE: 'Fl.',
};

/**
 * Complete item schema
 * - dbType: SQLite column definition
 * - uiType: UI component type (string, number, date, select)
 * - showInTable: Whether to display in the table view
 * - label: Display label for UI
 * - required: Whether field is required
 */
export const ITEM_SCHEMA = [
    {
        key: 'id',
        label: 'ID',
        dbType: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        uiType: 'number',
        required: false
    },
    {
        key: 'name',
        label: 'Name',
        dbType: 'TEXT NOT NULL',
        uiType: 'string',
        required: true
    },
    {
        key: 'type',
        label: 'Typ',
        dbType: 'TEXT NOT NULL',
        uiType: 'select',
        required: true
    },
    {
        key: 'quantity',
        label: 'Menge',
        dbType: 'INTEGER',
        uiType: 'number',
        required: false
    },
    {
        key: 'quantityUnit',
        label: 'Einheit',
        dbType: 'TEXT',
        uiType: 'select',
        required: false,
        defaultOptions: DEFAULT_QUANTITY_UNITS,
        allowCustom: false
    },
    {
        key: 'expiry',
        label: 'MHD',
        dbType: 'TEXT',
        uiType: 'date',
        dateType: 'month',
        required: true
    },
    {
        key: 'daysUntilExpired',
        label: 'Tage Haltbar',
        dbType: 'INTEGER',
        uiType: 'number',
        required: false
    },
    {
        key: 'location',
        label: 'Lagerort',
        dbType: 'TEXT',
        uiType: 'select',
        required: false,
        defaultOptions: DEFAULT_STORAGE_LOCATIONS,
        allowCustom: true
    },
    {
        key: 'created',
        label: 'Erstellt',
        dbType: 'TEXT',
        uiType: 'date',
        required: false
    }
];
/**
 * Get all column keys except auto-generated ones
 */
export const getInputColumns = () => {
    return ITEM_SCHEMA.filter(col => col.key !== 'id' && col.key !== 'created');
};

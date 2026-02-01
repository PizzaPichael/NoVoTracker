export const DEFAULT_STORAGE_LOCATIONS = {
    FRIDGE: 'Kühlschrank',
    FREEZER: 'Gefrierschrank',
    PANTRY: 'Vorratsschrank',
    CELLAR: 'Keller'
};

export const PANTRY_COLUMNS = [
    { key: 'name', label: 'Name', type: 'string', required: true },
    { key: 'type', label: 'Typ', type: 'select', required: true },
    { key: 'quantity', label: 'Menge', type: 'number', required: false },
    { key: 'expiry', label: 'MHD', type: 'date', required: true },
    { key: 'location', label: 'Lagerort', type: 'select', required: false, defaultOptions: DEFAULT_STORAGE_LOCATIONS, allowCustom: true }
];
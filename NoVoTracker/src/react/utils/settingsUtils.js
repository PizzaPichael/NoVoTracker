/**
 * Settings utilities
 * Helper functions to access app settings from localStorage
 */

// Lade Einstellungen aus localStorage
const loadSettings = () => {
  const stored = localStorage.getItem('appSettings');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    defaultPersons: 1,
    storageLocations: ['Kühlschrank', 'Gefrierschrank', 'Vorratsschrank', 'Keller']
  };
};

// Speichere Einstellungen in localStorage
export const saveSettings = (settings) => {
  localStorage.setItem('appSettings', JSON.stringify(settings));
};

// Hole default Personenanzahl
export const getDefaultPersons = () => {
  const settings = loadSettings();
  return settings.defaultPersons;
};

// Hole Lagerorte
export const getStorageLocations = () => {
  const settings = loadSettings();
  return settings.storageLocations;
};

// Hole alle Settings
export const getSettings = () => {
  return loadSettings();
};

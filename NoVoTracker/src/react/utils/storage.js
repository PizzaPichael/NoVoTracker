import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

const STORAGE_FILE = 'lebensmittel.json';
const STORAGE_KEY = 'lebensmittel_data';

/**
 * Saves food items data
 * Uses Filesystem API in native apps, Preferences as fallback in browser
 */
export const saveItems = async (items) => {
  try {
    const data = JSON.stringify(items);
    
    if (window.Capacitor?.isNativePlatform()) {
      await Filesystem.writeFile({
        path: STORAGE_FILE,
        data: data,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
    } else {
      await Preferences.set({
        key: STORAGE_KEY,
        value: data
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving:', error);
    throw error;
  }
};

/**
 * Loads food items data
 */
export const loadItems = async () => {
  try {
    let data;
    
    if (window.Capacitor?.isNativePlatform()) {
      const result = await Filesystem.readFile({
        path: STORAGE_FILE,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      data = result.data;
    } else {
      const result = await Preferences.get({ key: STORAGE_KEY });
      data = result.value;
    }
    
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (error.message?.includes('File does not exist')) {
      return [];
    }
    console.error('Error loading:', error);
    return [];
  }
};

/**
 * Adds a new food item
 */
export const addItem = async (item) => {
  const all = await loadItems();
  const newItem = {
    id: Date.now(),
    ...item,
    created: new Date().toISOString()
  };
  all.push(newItem);
  await saveItems(all);
  return newItem;
};

/**
 * Updates a food item
 */
export const updateItem = async (id, updates) => {
  const all = await loadItems();
  const index = all.findIndex(l => l.id === id);
  if (index !== -1) {
    all[index] = { ...all[index], ...updates };
    await saveItems(all);
    return all[index];
  }
  return null;
};

/**
 * Deletes a food item
 */
export const deleteItem = async (id) => {
  const all = await loadItems();
  const filtered = all.filter(l => l.id !== id);
  await saveItems(filtered);
  return true;
};

/**
 * Deletes all data (for app reset)
 */
export const deleteAllData = async () => {
  try {
    if (window.Capacitor?.isNativePlatform()) {
      await Filesystem.deleteFile({
        path: STORAGE_FILE,
        directory: Directory.Data
      });
    } else {
      await Preferences.remove({ key: STORAGE_KEY });
    }
    return true;
  } catch (error) {
    console.error('Error deleting:', error);
    return false;
  }
};

/**
 * Exports data as JSON string (for backup)
 */
export const exportData = async () => {
  const all = await loadItems();
  return JSON.stringify(all, null, 2);
};

/**
 * Imports data from JSON string (for restore)
 */
export const importData = async (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    await saveItems(data);
    return true;
  } catch (error) {
    console.error('Error importing:', error);
    throw new Error('Invalid JSON format');
  }
};

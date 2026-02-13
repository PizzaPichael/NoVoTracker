import { addDBItem, loadDBItems } from '../src/react/utils/storage';

const testData = [
    { name: 'Milch', type: 'Molkereiprodukt', quantity: 2, quantityUnit: 'l', expiry: '2026-02-15', location: 'Kühlschrank' },
    { name: 'Brot', type: 'Backware', quantity: 1, quantityUnit: 'Stk', expiry: '2026-02-10', location: 'Vorratsschrank' },
    { name: 'Käse', type: 'Molkereiprodukt', quantity: 300, quantityUnit: 'g', expiry: '2026-02-20', location: 'Kühlschrank' },
    { name: 'Tomaten', type: 'Gemüse', quantity: 5, quantityUnit: 'Stk', expiry: '2026-02-12', location: 'Kühlschrank' },
    { name: 'Äpfel', type: 'Obst', quantity: 8, quantityUnit: 'Stk', expiry: '2026-02-25', location: 'Vorratsschrank' },
    { name: 'Hähnchen', type: 'Fleisch', quantity: 500, quantityUnit: 'g', expiry: '2026-02-08', location: 'Kühlschrank' },
    { name: 'Nudeln', type: 'Trockenwaren', quantity: 1000, quantityUnit: 'g', expiry: '2027-06-30', location: 'Vorratsschrank' },
    { name: 'Reis', type: 'Trockenwaren', quantity: 2, quantityUnit: 'kg', expiry: '2027-08-15', location: 'Vorratsschrank' },
    { name: 'Joghurt', type: 'Molkereiprodukt', quantity: 4, quantityUnit: 'Stk', expiry: '2026-02-14', location: 'Kühlschrank' },
    { name: 'Butter', type: 'Molkereiprodukt', quantity: 250, quantityUnit: 'g', expiry: '2026-03-05', location: 'Kühlschrank' },
    { name: 'Kartoffeln', type: 'Gemüse', quantity: 2, quantityUnit: 'kg', expiry: '2026-03-20', location: 'Keller' },
    { name: 'Zwiebeln', type: 'Gemüse', quantity: 1, quantityUnit: 'kg', expiry: '2026-03-15', location: 'Keller' },
    { name: 'Tiefkühlpizza', type: 'Fertiggericht', quantity: 2, quantityUnit: 'Stk', expiry: '2026-08-30', location: 'Gefrierschrank' },
    { name: 'Erbsen TK', type: 'Gemüse', quantity: 500, quantityUnit: 'g', expiry: '2026-12-31', location: 'Gefrierschrank' },
    { name: 'Erdbeermarmelade', type: 'Aufstrich', quantity: 1, quantityUnit: 'Glas', expiry: '2026-10-15', location: 'Vorratsschrank' },
    { name: 'Olivenöl', type: 'Öl', quantity: 750, quantityUnit: 'ml', expiry: '2027-01-20', location: 'Vorratsschrank' },
    { name: 'Eier', type: 'Molkereiprodukt', quantity: 10, quantityUnit: 'Stk', expiry: '2026-02-18', location: 'Kühlschrank' },
    { name: 'Orangensaft', type: 'Getränk', quantity: 1, quantityUnit: 'l', expiry: '2026-02-22', location: 'Kühlschrank' },
    { name: 'Schokolade', type: 'Süßigkeit', quantity: 200, quantityUnit: 'g', expiry: '2026-06-30', location: 'Vorratsschrank' },
    { name: 'Salami', type: 'Wurst', quantity: 250, quantityUnit: 'g', expiry: '2026-02-16', location: 'Kühlschrank' }
];

export const insertTestData = async () => {
    const existing = await loadDBItems();
    if (existing.length >= 20) {
        return 0;
    }

    for (const item of testData) {
        await addDBItem(item);
    }

    return testData.length;
};

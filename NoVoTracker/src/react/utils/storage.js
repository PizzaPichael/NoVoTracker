const SQLITE_REMOVED_ERROR = new Error(
    'SQLite wurde entfernt. Bitte das Storage-Setup neu konfigurieren.'
);

const throwSqliteRemoved = () => {
    throw SQLITE_REMOVED_ERROR;
};

export const initDB = async () => {
    throwSqliteRemoved();
};

export const loadDBItems = async () => {
    throwSqliteRemoved();
};

export const addDBItem = async () => {
    throwSqliteRemoved();
};

export const loadItems = async () => {
    throwSqliteRemoved();
};

export const addItem = async () => {
    throwSqliteRemoved();
};

export const updateItem = async () => {
    throwSqliteRemoved();
};

export const deleteItem = async () => {
    throwSqliteRemoved();
};

export const exportData = async () => {
    throwSqliteRemoved();
};

export const importData = async () => {
    throwSqliteRemoved();
};

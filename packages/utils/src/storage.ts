export const setStorageItem = (key: string, value: any, storage: Storage = window.localStorage) => {
    try {
        storage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to storage', error);
    }
};

export const getStorageItem = <T>(key: string, storage: Storage = window.localStorage): T | null => {
    try {
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from storage', error);
        return null;
    }
};

export const removeStorageItem = (key: string, storage: Storage = window.localStorage) => {
    storage.removeItem(key);
};

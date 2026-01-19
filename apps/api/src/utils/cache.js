// apps/api/src/utils/cache.js

const cache = new Map();

export const memoryCache = {
    set: (key, value, ttlSeconds = 60) => {
        const expiry = Date.now() + ttlSeconds * 1000;
        cache.set(key, { value, expiry });
    },

    get: (key) => {
        const item = cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            cache.delete(key);
            return null;
        }

        return item.value;
    },

    delete: (key) => {
        cache.delete(key);
    },

    clear: () => {
        cache.clear();
    }
};

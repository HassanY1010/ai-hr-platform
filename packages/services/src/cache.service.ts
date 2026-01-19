class CacheService {
    private cache = new Map<string, any>();

    set(key: string, value: any, ttl = 300000) { // Default 5 mins
        const expiry = Date.now() + ttl;
        this.cache.set(key, { value, expiry });
    }

    get<T>(key: string): T | null {
        const data = this.cache.get(key);
        if (!data) return null;
        if (Date.now() > data.expiry) {
            this.cache.delete(key);
            return null;
        }
        return data.value;
    }

    clear() {
        this.cache.clear();
    }
}

export const cacheService = new CacheService();

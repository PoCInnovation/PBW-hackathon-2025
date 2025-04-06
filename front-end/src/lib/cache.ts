interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class Cache {
    private static instance: Cache;
    private cache: Map<string, CacheEntry<any>>;
    private readonly TTL: number = 5 * 60 * 1000; // 5 minutes

    private constructor() {
        this.cache = new Map();
    }

    public static getInstance(): Cache {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }

    public set<T>(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    public get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.TTL) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    public clear(): void {
        this.cache.clear();
    }
}

export const marketCache = Cache.getInstance(); 
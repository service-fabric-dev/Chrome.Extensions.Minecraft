
class CacheAdapter {
    static _cache = { }; // Local cache

    get(id) {
        return CacheAdapter._cache[id];
    }

    set(key, object) {
        CacheAdapter._cache[key] = object;
    }
}
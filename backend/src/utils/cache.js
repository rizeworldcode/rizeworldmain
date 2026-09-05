/**
 * High-Performance In-Memory TTL Cache with Single-Flight (Request Coalescing) & Prefix Invalidation.
 * Prevents Cache Stampedes under heavy concurrent request traffic.
 */
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.inFlight = new Map();
  }

  /**
   * Get cached item if it exists and hasn't expired.
   * @param {string} key 
   * @returns {any|null}
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set cached item with TTL in seconds (default 60s).
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlSeconds 
   */
  set(key, value, ttlSeconds = 60) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Single-Flight Request Coalescing:
   * If item is cached, returns it immediately.
   * If calculation is already in-flight (pending), reuses the active promise.
   * Otherwise executes fetcherFn(), caches result, and resolves all waiting callers.
   * 
   * @param {string} key 
   * @param {Function} fetcherFn async () => data
   * @param {number} ttlSeconds 
   * @returns {Promise<any>}
   */
  async fetchOrCompute(key, fetcherFn, ttlSeconds = 60) {
    const cached = this.get(key);
    if (cached !== null) return cached;

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    const promise = (async () => {
      try {
        const result = await fetcherFn();
        this.set(key, result, ttlSeconds);
        return result;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * Delete a specific cache key.
   * @param {string} key 
   */
  del(key) {
    this.cache.delete(key);
    this.inFlight.delete(key);
  }

  /**
   * Invalidate all cache keys that start with a prefix (e.g. 'clients:', 'dashboard:').
   * @param {string} prefix 
   */
  flushByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
    for (const key of this.inFlight.keys()) {
      if (key.startsWith(prefix)) {
        this.inFlight.delete(key);
      }
    }
  }

  /**
   * Flush entire cache.
   */
  clear() {
    this.cache.clear();
    this.inFlight.clear();
  }
}

const memoryCache = new MemoryCache();
module.exports = memoryCache;

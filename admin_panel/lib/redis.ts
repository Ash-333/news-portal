import { LRUCache } from 'lru-cache'

interface CacheValue {
  [key: string]: unknown
}

const globalForLruCache = globalThis as unknown as {
  __lruCache?: LRUCache<string, CacheValue>
  __lruCounters?: LRUCache<string, { value: number; expiresAt: number }>
}

const MAX_CACHE_ITEMS = parseInt(process.env.LRU_MAX_ITEMS || '500')
const MAX_CACHE_AGE_MS = parseInt(process.env.LRU_MAX_AGE_MS || '300000')

export const cache = globalForLruCache.__lruCache ?? new LRUCache<string, CacheValue>({
  max: MAX_CACHE_ITEMS,
  ttl: MAX_CACHE_AGE_MS,
  allowStale: false,
  updateAgeOnGet: true,
})

const counters = globalForLruCache.__lruCounters ?? new LRUCache<string, { value: number; expiresAt: number }>({
  max: 1000,
  ttl: 3600000,
})

if (process.env.NODE_ENV !== 'production') {
  globalForLruCache.__lruCache = cache
  globalForLruCache.__lruCounters = counters
}

function buildCacheKey(prefix: string, params: Record<string, unknown> = {}): string {
  const sorted = Object.keys(params)
    .sort()
    .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map(k => `${k}=${String(params[k])}`)
    .join('&')
  return sorted ? `${prefix}?${sorted}` : prefix
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const value = cache.get(key)
    if (value === undefined) return null
    return value as T
  } catch (error) {
    console.error('[CACHE] Get error:', error)
    return null
  }
}

export async function setCached<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
  try {
    cache.set(key, data as unknown as CacheValue, { ttl: ttlSeconds * 1000 })
  } catch (error) {
    console.error('[CACHE] Set error:', error)
  }
}

export async function deleteCached(key: string): Promise<void> {
  try {
    cache.delete(key)
  } catch (error) {
    console.error('[CACHE] Delete error:', error)
  }
}

export async function deleteCachedPattern(pattern: string): Promise<number> {
  let deleted = 0
  const prefix = pattern.replace('*', '')
  
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      if (cache.delete(key)) deleted++
    }
  }
  
  return deleted
}

export async function clearAllCache(): Promise<void> {
  cache.clear()
}

export async function cachedApi<T>(
  prefix: string,
  params: Record<string, unknown>,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const key = buildCacheKey(prefix, params)
  
  const cached = await getCached<T>(key)
  if (cached !== null) {
    return cached
  }
  
  const data = await fetchFn()
  
  await setCached(key, data, ttlSeconds)
  
  return data
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Math.floor(Date.now() / 1000)
  const windowKey = Math.floor(now / windowSeconds)
  const rateKey = `ratelimit:${key}:${windowKey}`

  const existing = counters.get(rateKey)
  const current = (existing?.value ?? 0) + 1
  const expiresAt = existing?.expiresAt ?? (Date.now() + windowSeconds * 1000)

  counters.set(rateKey, { value: current, expiresAt }, { ttl: windowSeconds * 1000 })

  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetTime: now + windowSeconds,
  }
}

export async function storeSession(sessionId: string, data: unknown, expirySeconds: number = 86400): Promise<void> {
  await setCached(`session:${sessionId}`, data, expirySeconds)
}

export async function getSession<T>(sessionId: string): Promise<T | null> {
  return getCached<T>(`session:${sessionId}`)
}

export async function deleteSession(sessionId: string): Promise<void> {
  await deleteCached(`session:${sessionId}`)
}

export async function getCache<T>(key: string): Promise<T | null> {
  return getCached<T>(`cache:${key}`)
}

export async function setCache(key: string, data: unknown, expirySeconds: number = 3600): Promise<void> {
  await setCached(`cache:${key}`, data, expirySeconds)
}

export async function deleteCache(key: string): Promise<void> {
  await deleteCached(`cache:${key}`)
}

export async function clearCachePattern(pattern: string): Promise<number> {
  return deleteCachedPattern(`cache:${pattern}`)
}

export function getCacheStats() {
  return {
    size: cache.size,
    max: MAX_CACHE_ITEMS,
    ttl: MAX_CACHE_AGE_MS,
  }
}
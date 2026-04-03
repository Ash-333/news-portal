type CacheEntry = {
  value: string
  expiresAt: number | null
}

type CounterEntry = {
  value: number
  expiresAt: number | null
}

class MemoryRedis {
  private store = new Map<string, CacheEntry>()
  private counters = new Map<string, CounterEntry>()

  private isExpired(expiresAt: number | null): boolean {
    return expiresAt !== null && expiresAt <= Date.now()
  }

  private pruneValue(key: string): void {
    const entry = this.store.get(key)
    if (entry && this.isExpired(entry.expiresAt)) {
      this.store.delete(key)
    }
  }

  private pruneCounter(key: string): void {
    const entry = this.counters.get(key)
    if (entry && this.isExpired(entry.expiresAt)) {
      this.counters.delete(key)
    }
  }

  private getMatchingKeys(pattern: string): string[] {
    const regex = new RegExp(
      `^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`
    )

    const keys = new Set<string>()

    for (const key of Array.from(this.store.keys())) {
      this.pruneValue(key)
      if (this.store.has(key)) {
        keys.add(key)
      }
    }

    for (const key of Array.from(this.counters.keys())) {
      this.pruneCounter(key)
      if (this.counters.has(key)) {
        keys.add(key)
      }
    }

    return Array.from(keys).filter((key) => regex.test(key))
  }

  async get(key: string): Promise<string | null> {
    this.pruneValue(key)
    return this.store.get(key)?.value ?? null
  }

  async setex(key: string, ttlSeconds: number, value: string): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0

    for (const key of keys) {
      const removedValue = this.store.delete(key)
      const removedCounter = this.counters.delete(key)
      if (removedValue || removedCounter) {
        deleted += 1
      }
    }

    return deleted
  }

  async keys(pattern: string): Promise<string[]> {
    return this.getMatchingKeys(pattern)
  }

  async incr(key: string): Promise<number> {
    this.pruneCounter(key)
    const current = this.counters.get(key)
    const nextValue = (current?.value ?? 0) + 1

    this.counters.set(key, {
      value: nextValue,
      expiresAt: current?.expiresAt ?? null,
    })

    return nextValue
  }

  async expire(key: string, ttlSeconds: number): Promise<number> {
    const expiresAt = Date.now() + ttlSeconds * 1000

    const valueEntry = this.store.get(key)
    if (valueEntry) {
      valueEntry.expiresAt = expiresAt
      this.store.set(key, valueEntry)
      return 1
    }

    const counterEntry = this.counters.get(key)
    if (counterEntry) {
      counterEntry.expiresAt = expiresAt
      this.counters.set(key, counterEntry)
      return 1
    }

    return 0
  }

  async ttl(key: string): Promise<number> {
    this.pruneValue(key)
    this.pruneCounter(key)

    const entry = this.store.get(key) ?? this.counters.get(key)
    if (!entry) {
      return -2
    }

    if (entry.expiresAt === null) {
      return -1
    }

    return Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1000))
  }
}

const globalForMemoryRedis = globalThis as typeof globalThis & {
  __memoryRedis?: MemoryRedis
}

export const redis = globalForMemoryRedis.__memoryRedis ?? new MemoryRedis()

if (process.env.NODE_ENV !== 'production') {
  globalForMemoryRedis.__memoryRedis = redis
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Math.floor(Date.now() / 1000)
  const windowKey = Math.floor(now / windowSeconds)
  const redisKey = `ratelimit:${key}:${windowKey}`

  const current = await redis.incr(redisKey)

  if (current === 1) {
    await redis.expire(redisKey, windowSeconds)
  }

  const ttl = await redis.ttl(redisKey)
  const safeTtl = ttl > 0 ? ttl : windowSeconds

  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetTime: now + safeTtl,
  }
}

export async function storeSession(sessionId: string, data: unknown, expirySeconds: number = 86400): Promise<void> {
  await redis.setex(`session:${sessionId}`, expirySeconds, JSON.stringify(data))
}

export async function getSession<T>(sessionId: string): Promise<T | null> {
  const data = await redis.get(`session:${sessionId}`)
  if (!data) return null
  return JSON.parse(data) as T
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`)
}

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(`cache:${key}`)
  if (!data) return null
  return JSON.parse(data) as T
}

export async function setCache(key: string, data: unknown, expirySeconds: number = 3600): Promise<void> {
  await redis.setex(`cache:${key}`, expirySeconds, JSON.stringify(data))
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(`cache:${key}`)
}

export async function clearCachePattern(pattern: string): Promise<number> {
  const keys = await redis.keys(`cache:${pattern}`)
  if (keys.length === 0) {
    return 0
  }

  await redis.del(...keys)
  return keys.length
}

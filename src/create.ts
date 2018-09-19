
import { Cache } from "./interfaces/cache"
import { CacheConfig } from "./interfaces/config"

import { LocalCache } from "./driver/local/cache"
import { MemcachedCache } from "./driver/memcached/cache"
import { RedisCache } from "./driver/redis/cache"

export function create<P>(config: CacheConfig): Cache {
  if (config.adapter === "local") {
    return new LocalCache()
  } else if (config.adapter === "memcached") {
    const {adapter, location, ...options} = config
    const Memcached = require("memcached")
    return new MemcachedCache(new Memcached(location, options))
  } else if (config.adapter === "redis") {
    const {adapter, ...options} = config
    const redis = require("redis")
    return new RedisCache(redis.createClient(options))
  }
  throw new Error(`cannot resolve adapter named "${(config as any).adapter}"`)
}

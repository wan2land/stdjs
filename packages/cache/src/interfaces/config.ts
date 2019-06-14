
import { LocalCacheConfig } from "../driver/local/interfaces"
import { MemcachedCacheConfig } from "../driver/memcached/interfaces"
import { RedisCacheConfig } from "../driver/redis/interfaces"

export type CacheConfig = LocalCacheConfig
  | MemcachedCacheConfig
  | RedisCacheConfig

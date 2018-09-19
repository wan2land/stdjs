
import { LocalCacheConfig } from "../driver/local/interfaces"
import { MemcachedCacheConfig } from "../driver/memcached/interfaces"

export type CacheConfig = LocalCacheConfig
  | MemcachedCacheConfig

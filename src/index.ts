
export { create} from "./create"

export { CacheConfig } from "./interfaces/config"
export { Cache } from "./interfaces/cache"

export * from "./driver/local/interfaces"
export { LocalCache } from "./driver/local/cache"

export * from "./driver/memcached/interfaces"
export { MemcachedCache } from "./driver/memcached/cache"

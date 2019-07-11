/* eslint-disable import/no-unresolved, @typescript-eslint/no-require-imports */
import { LocalCache } from './driver/local/cache'
import { MemcachedCache } from './driver/memcached/cache'
import { RedisCache } from './driver/redis/cache'
import { Cache } from './interfaces/cache'
import { CacheConfig } from './interfaces/config'


export function create(config: CacheConfig): Cache {
  if (config.adapter === 'local') {
    return new LocalCache()
  } if (config.adapter === 'memcached') {
    const { adapter, location, ...options } = config
    const Memcached = require('memcached')
    return new MemcachedCache(new Memcached(location, options))
  } if (config.adapter === 'redis') {
    const { adapter, ...options } = config
    const redis = require('redis')
    return new RedisCache(redis.createClient(options))
  }
  throw new Error(`cannot resolve adapter named "${(config as any).adapter}"`)
}

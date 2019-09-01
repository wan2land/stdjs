import { Redis } from 'ioredis'

import { Cache } from '../../interfaces/cache'


export class IORedisCache implements Cache {

  public constructor(public redis: Redis) {
  }

  public close() {
    this.redis.disconnect()
    return Promise.resolve(true) // nothing to close :-)
  }

  public async get<T>(key: string, defaultValue?: T) {
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : defaultValue
  }

  public async set<T>(key: string, value: T, ttl?: number) {
    if (typeof ttl !== 'undefined' && ttl >= 0) {
      const data = await this.redis.set(key, JSON.stringify(value), 'EX', ttl)
      return data === 'OK'
    }
    const data = await this.redis.set(key, JSON.stringify(value))
    return data === 'OK'
  }

  public async has(key: string) {
    const data = await this.redis.exists(key)
    return data === 1
  }

  public async delete(key: string) {
    const data = await this.redis.del(key)
    return data === 1
  }

  public async clear() {
    return (await this.redis.flushall()) === 'OK'
  }
}

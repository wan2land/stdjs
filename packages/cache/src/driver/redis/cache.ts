
import { Cache } from '../../interfaces/cache'
import { RawRedisCallback, RawRedisClient } from './interfaces'


export class RedisCache implements Cache {

  public constructor(public redis: RawRedisClient) {
  }

  public close() {
    this.redis.end()
    return Promise.resolve(true) // nothing to close :-)
  }

  public get<TVal>(key: string, defaultValue?: TVal) {
    return new Promise<TVal | undefined>((resolve, reject) => {
      this.redis.get(key, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        try {
          resolve(data ? JSON.parse(data) : defaultValue)
        } catch (e) {
          reject(e) // JSON parse error
        }
      })
    })
  }

  public set<TVal>(key: string, value: TVal, ttl?: number) {
    return new Promise<boolean>((resolve, reject) => {
      const cb: RawRedisCallback<'OK' | undefined> = (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result === 'OK')
      }
      if (typeof ttl !== 'undefined' && ttl >= 0) {
        this.redis.set(key, JSON.stringify(value), 'EX', ttl, cb)
      } else {
        this.redis.set(key, JSON.stringify(value), cb)
      }
    })
  }

  public has(key: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.redis.exists(key, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result === 1)
      })
    })
  }

  public delete(key: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.redis.del(key, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result > 0)
      })
    })
  }

  public clear() {
    return new Promise<boolean>((resolve, reject) => {
      this.redis.flushall((err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result === 'OK')
      })
    })
  }
}

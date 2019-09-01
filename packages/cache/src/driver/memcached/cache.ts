import Memcached from 'memcached'

import { Cache } from '../../interfaces/cache'


export class MemcachedCache implements Cache {

  public constructor(public memcached: Memcached) {
  }

  public close() {
    this.memcached.end()
    return Promise.resolve(true)
  }

  public get<T>(key: string, defaultValue?: T) {
    return new Promise<T | undefined>((resolve, reject) => {
      this.memcached.get(key, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(typeof data !== 'undefined' ? data as T : defaultValue)
      })
    })
  }

  public set<T>(key: string, value: T, ttl?: number) {
    return new Promise<boolean>((resolve, reject) => {
      this.memcached.set(
        key,
        value,
        typeof ttl !== 'undefined' && ttl >= 0 ? ttl : 2592000,
        (err, result) => {
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        }
      )
    })
  }

  public async has(key: string) {
    const result = await this.get(key)
    return typeof result !== 'undefined'
  }

  public delete(key: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.memcached.del(key, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  public clear() {
    return new Promise<boolean>((resolve, reject) => {
      this.memcached.flush((err, results) => {
        if (err) {
          reject(err)
          return
        }
        for (const result of results) {
          if (!result) {
            resolve(false)
            return
          }
        }
        resolve(true)
      })
    })
  }
}

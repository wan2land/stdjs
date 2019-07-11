import { Cache } from '../../interfaces/cache'
import { RawMemcached } from './interfaces'


export class MemcachedCache implements Cache {

  public constructor(public memcached: RawMemcached) {
  }

  public close() {
    this.memcached.end()
    return Promise.resolve(true)
  }

  public get<TVal>(key: string, defaultValue?: TVal) {
    return new Promise<TVal | undefined>((resolve, reject) => {
      this.memcached.get(key, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(typeof data !== 'undefined' ? data as TVal : defaultValue)
      })
    })
  }

  public set<TVal>(key: string, value: TVal, ttl?: number) {
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

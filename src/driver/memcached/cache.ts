
import * as Memcached from "memcached"
import { Cache } from "../../interfaces/cache"

export class MemcachedCache implements Cache {

  public constructor(public memcached: Memcached) {
  }

  public async close(): Promise<boolean> {
    return true // nothing to close :-)
  }

  public get<P>(key: string, defaultValue?: P): Promise<P | undefined> {
    return new Promise((resolve, reject) => {
      this.memcached.get(key, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  public set<P>(key: string, value: P, ttl?: number): Promise<boolean> {
    const expire = typeof ttl !== "undefined" && ttl > 0
      ? Math.floor(ttl / 1000)
      : 2592000

    return new Promise((resolve, reject) => {
      this.memcached.set(key, value, expire, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  public async has(key: string): Promise<boolean> {
    const result = await this.get(key)
    return typeof result !== "undefined"
  }

  public delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.memcached.del(key, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  public clear(): Promise<boolean> {
    return new Promise((resolve, reject) => {
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

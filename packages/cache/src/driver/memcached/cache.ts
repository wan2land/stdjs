
import { Cache } from "../../interfaces/cache"
import { RawMemcached } from "./interfaces"

export class MemcachedCache implements Cache {

  public constructor(public memcached: RawMemcached) {
  }

  public async close(): Promise<boolean> {
    this.memcached.end()
    return true
  }

  public get<P>(key: string, defaultValue?: P): Promise<P | undefined> {
    return new Promise((resolve, reject) => {
      this.memcached.get(key, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(typeof data !== "undefined" ? data : defaultValue)
      })
    })
  }

  public set<P>(key: string, value: P, ttl?: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.memcached.set(
        key,
        value,
        typeof ttl !== "undefined" && ttl >= 0 ? ttl : 2592000,
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

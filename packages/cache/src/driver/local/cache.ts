
import { Cache } from "../../interfaces/cache"

export class LocalCache implements Cache {

  public values = new Map<string, any>()
  public expires = new Map<string, number>()

  public async close(): Promise<boolean> {
    return true // nothing to close :-)
  }

  public async get<P>(key: string, defaultValue?: P): Promise<P | undefined> {
    if (this.has(key)) {
      return this.values.get(key)
    }
    return defaultValue
  }

  public async set<P>(key: string, value: P, ttl?: number): Promise<boolean> {
    this.values.set(key, value)
    const expire = typeof ttl !== "undefined" && ttl >= 0
      ? new Date().getTime() + ttl * 1000
      : Number.MAX_SAFE_INTEGER
    this.expires.set(key, expire)
    return true
  }

  public async has(key: string): Promise<boolean> {
    if (!this.expires.has(key)) {
      return false
    }
    const expire = this.expires.get(key)!
    if (expire < new Date().getTime()) {
      this.values.delete(key)
      this.expires.delete(key)
      return false
    }
    return true
  }

  public async delete(key: string): Promise<boolean> {
    if (this.has(key)) {
      const result = this.values.delete(key)
      this.expires.delete(key)
      return result
    }
    return false
  }

  public async clear(): Promise<boolean> {
    this.values.clear()
    this.expires.clear()
    return true
  }
}

import { Cache } from '../../interfaces/cache'


export class LocalCache implements Cache {

  public values = new Map<string, any>()
  public expires = new Map<string, number>()

  public close(): Promise<boolean> {
    return Promise.resolve(true) // nothing to close :-)
  }

  public get<TVal>(key: string, defaultValue?: TVal) {
    if (this.has(key)) {
      return Promise.resolve(this.values.get(key) as TVal)
    }
    return Promise.resolve(defaultValue)
  }

  public set<TVal>(key: string, value: TVal, ttl?: number) {
    this.values.set(key, value)
    const expire = typeof ttl !== 'undefined' && ttl >= 0
      ? new Date().getTime() + ttl * 1000
      : Number.MAX_SAFE_INTEGER
    this.expires.set(key, expire)
    return Promise.resolve(true)
  }

  public has(key: string) {
    if (!this.expires.has(key)) {
      return Promise.resolve(false)
    }
    const expire = this.expires.get(key) || 0
    if (expire < new Date().getTime()) {
      this.values.delete(key)
      this.expires.delete(key)
      return Promise.resolve(false)
    }
    return Promise.resolve(true)
  }

  public delete(key: string) {
    if (this.has(key)) {
      const result = this.values.delete(key)
      this.expires.delete(key)
      return Promise.resolve(result)
    }
    return Promise.resolve(false)
  }

  public clear() {
    this.values.clear()
    this.expires.clear()
    return Promise.resolve(true)
  }
}

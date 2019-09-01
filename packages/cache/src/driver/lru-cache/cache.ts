import Lru from 'lru-cache'

import { Cache } from '../../interfaces/cache'


export class LruCache implements Cache {

  public constructor(public lru: Lru<any, any>) {
  }

  public close() {
    return Promise.resolve(true) // nothing to close :-)
  }

  public get<T>(key: string, defaultValue?: T) {
    return Promise.resolve(this.lru.get(key) || defaultValue)
  }

  public set<T>(key: string, value: T, ttl?: number) {
    return Promise.resolve(this.lru.set(key, value, ttl ? ttl * 1000 : undefined))
  }

  public has(key: string) {
    return Promise.resolve(this.lru.has(key))
  }

  public delete(key: string) {
    if (this.lru.has(key)) {
      this.lru.del(key)
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }

  public clear() {
    this.lru.reset()
    return Promise.resolve(true)
  }
}

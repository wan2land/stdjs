
// import * as Memcached from "memcached"

export interface MemcachedCacheConfig extends RawMemcachedLocation, RawMemcachedOptions {
  readonly adapter: 'memcached'
}

// from Memcached.Location
export interface RawMemcachedLocation {
  location: string | string[] | {[server: string]: number}
}

// from Memcached.options
export interface RawMemcachedOptions {
  maxKeySize?: number
  maxExpiration?: number
  maxValue?: number
  poolSize?: number
  algorithm?: string
  reconnect?: number
  timeout?: number
  retries?: number
  failures?: number
  retry?: number
  remove?: boolean
  failOverServers?: string|string[]
  keyCompression?: boolean
  idle?: number
  namespace?: string
  [key: string]: any
}

export interface RawMemcached {
  get(key: string, cb: (this: RawMemcachedCommandData, err: any, data: any) => void): void
  set(key: string, value: any, lifetime: number, cb: (this: RawMemcachedCommandData, err: any, result: boolean) => void): void
  del(key: string, cb: (this: RawMemcachedCommandData, err: any, result: boolean) => void): void
  flush(cb: (this: undefined, err: any, results: boolean[]) => void): void
  end(): void
}

export interface RawMemcachedCommandData {
  start: number
  execution: number
  type: string
  command: string
  validate: [string, (...args: any[]) => any][]
  cas?: string
  redundancyEnabled?: boolean
  key?: string
  value?: any
  lifetime?: number
  callback(...args: any[]): any
}

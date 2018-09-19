
// import * as Memcached from "memcached"

export interface MemcachedCacheConfig extends RawMemcachedLocation, RawMemcachedOptions {
  readonly adapter: "memcached"
}

// from Memcached.Location
export interface RawMemcachedLocation {
  location: string | string[] | {[server: string]: number}
}

// from Memcached.options
export interface RawMemcachedOptions {
  maxKeySize ?: number
  maxExpiration ?: number
  maxValue ?: number
  poolSize ?: number
  algorithm ?: string
  reconnect ?: number
  timeout ?: number
  retries ?: number
  failures ?: number
  retry ?: number
  remove ?: boolean
  failOverServers ?: string|string[]
  keyCompression ?: boolean
  idle ?: number
  namespace ?: string
  [key: string]: any
}

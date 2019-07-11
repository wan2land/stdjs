
// import { ClientOpts } from "Redis"

export interface RedisCacheConfig extends RawRedisOptions {
  readonly adapter: 'redis'
}

// from ClientOpts
export interface RawRedisOptions {
  host?: string
  port?: number
  path?: string
  url?: string
  parser?: string
  string_numbers?: boolean
  return_buffers?: boolean
  detect_buffers?: boolean
  socket_keepalive?: boolean
  no_ready_check?: boolean
  enable_offline_queue?: boolean
  retry_max_delay?: number
  connect_timeout?: number
  max_attempts?: number
  retry_unfulfilled_commands?: boolean
  auth_pass?: string
  password?: string
  db?: string | number
  family?: string
  rename_commands?: { [command: string]: string } | null
  tls?: any
  prefix?: string
  retry_strategy?: RawRedisRetryStrategy
  [key: string]: any
}

export type RawRedisRetryStrategy = (options: RawRedisRetryStrategyOptions) => number | Error

export interface RawRedisRetryStrategyOptions {
  error: NodeJS.ErrnoException
  total_retry_time: number
  times_connected: number
  attempt: number
}

export interface RawRedisClient {
  exists: RawRedisOverloadedCommand<string, number, boolean>
  del: RawRedisOverloadedCommand<string, number, boolean>
  end(flush?: boolean): void
  get(key: string, cb?: RawRedisCallback<string>): boolean
  set(key: string, value: string, cb?: RawRedisCallback<'OK'>): boolean
  set(key: string, value: string, flag: string, cb?: RawRedisCallback<'OK'>): boolean
  set(key: string, value: string, mode: string, duration: number, cb?: RawRedisCallback<'OK' | undefined>): boolean
  set(key: string, value: string, mode: string, duration: number, flag: string, cb?: RawRedisCallback<'OK' | undefined>): boolean
  flushall(cb?: RawRedisCallback<string>): boolean
}

export type RawRedisCallback<T> = (err: Error | null, reply: T) => void

export interface RawRedisOverloadedCommand<T1, T2, T3> {
  (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T1, arg6: T1, cb?: RawRedisCallback<T2>): T3
  (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T1, cb?: RawRedisCallback<T2>): T3
  (arg1: T1, arg2: T1, arg3: T1, arg4: T1, cb?: RawRedisCallback<T2>): T3
  (arg1: T1, arg2: T1, arg3: T1, cb?: RawRedisCallback<T2>): T3
  (arg1: T1, arg2: T1 | T1[], cb?: RawRedisCallback<T2>): T3
  (arg1: T1 | T1[], cb?: RawRedisCallback<T2>): T3
  (...args: (T1 | RawRedisCallback<T2>)[]): T3
}

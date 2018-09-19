
// import { ClientOpts } from "Redis"

export interface RedisCacheConfig extends RawRedisOptions {
  readonly adapter: "redis"
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

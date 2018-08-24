
export interface AmqpQueueConfig extends RawAmqpConnectOptions {
  readonly adapter: "amqplib"
  readonly queue: string
}

// import { Options } from "amqplib"
// from Options.Connect

export interface RawAmqpConnectOptions {
  protocol?: string
  hostname?: string
  port?: number
  username?: string
  password?: string
  locale?: string
  frameMax?: number
  heartbeat?: number
  vhost?: string
}

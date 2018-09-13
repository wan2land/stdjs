
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

export interface RawAmqpConnection {
  close(): Promise<void>
  createChannel(): Promise<RawAmqpChannel>
  createConfirmChannel(): Promise<RawAmqpConfirmChannel>
}

export interface RawAmqpConfirmChannel extends RawAmqpChannel {
  publish(exchange: string, routingKey: string, content: Buffer, options?: any, callback?: (err: any, ok: {}) => void): boolean
  sendToQueue(queue: string, content: Buffer, options?: any, callback?: (err: any, ok: {}) => void): boolean
  waitForConfirms(): Promise<void>
}

export interface RawAmqpChannel {
  close(): Promise<void>

  assertQueue(queue: string, options?: any): Promise<RawAmqpRepliesAssertQueue>
  checkQueue(queue: string): Promise<RawAmqpRepliesAssertQueue>

  deleteQueue(queue: string, options?: any): Promise<RawAmqpRepliesDeleteQueue>
  purgeQueue(queue: string): Promise<RawAmqpRepliesPurgeQueue>

  bindQueue(queue: string, source: string, pattern: string, args?: any): Promise<{}>
  unbindQueue(queue: string, source: string, pattern: string, args?: any): Promise<{}>

  assertExchange(exchange: string, type: string, options?: any): Promise<RawAmqpRepliesAssertExchange>
  checkExchange(exchange: string): Promise<{}>

  deleteExchange(exchange: string, options?: any): Promise<{}>

  bindExchange(destination: string, source: string, pattern: string, args?: any): Promise<{}>
  unbindExchange(destination: string, source: string, pattern: string, args?: any): Promise<{}>

  publish(exchange: string, routingKey: string, content: Buffer, options?: any): boolean
  sendToQueue(queue: string, content: Buffer, options?: any): boolean

  consume(queue: string, onMessage: (msg: RawAmqpMessage | null) => any, options?: any): Promise<RawAmqpRepliesConsume>

  cancel(consumerTag: string): Promise<{}>
  get(queue: string, options?: any): Promise<RawAmqpMessage | false>
  reject(message: RawAmqpMessage, requeue?: boolean): void

  ack(message: RawAmqpMessage, allUpTo?: boolean): void
  ackAll(): void

  nack(message: RawAmqpMessage, allUpTo?: boolean, requeue?: boolean): void
  nackAll(requeue?: boolean): void
  reject(message: RawAmqpMessage, requeue?: boolean): void

  prefetch(count: number, global?: boolean): Promise<{}>
  recover(): Promise<{}>
}

export interface RawAmqpMessage {
  content: Buffer
  fields: any
  properties: any
}

export interface RawAmqpRepliesAssertQueue {
  queue: string
  messageCount: number
  consumerCount: number
}
export interface RawAmqpRepliesPurgeQueue {
  messageCount: number
}
export interface RawAmqpRepliesDeleteQueue {
  messageCount: number
}
export interface RawAmqpRepliesAssertExchange {
  exchange: string
}
export interface RawAmqpRepliesConsume {
  consumerTag: string
}

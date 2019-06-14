
// import { Options } from "amqplib"
// from Options.Connect

export interface AmqpQueueConfig extends RawAmqpConnectOptions {
  readonly adapter: "amqplib"
  readonly queue: string
}

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
}

export interface RawAmqpChannel {
  close(): Promise<void>
  assertQueue(queue: string, options?: RawAmqpOptionsAssertQueue): Promise<RawAmqpRepliesAssertQueue>
  purgeQueue(queue: string): Promise<RawAmqpRepliesPurgeQueue>
  sendToQueue(queue: string, content: Buffer, options?: RawAmqpOptionsPublish): boolean
  get(queue: string): Promise<RawAmqpMessage | false>
  ack(message: RawAmqpMessage, allUpTo?: boolean): void
}

export interface RawAmqpOptionsPublish {
  priority?: number
}

export interface RawAmqpRepliesPurgeQueue {
  messageCount: number
}

export interface RawAmqpRepliesAssertQueue {
  queue: string
  messageCount: number
  consumerCount: number
}

export interface RawAmqpOptionsAssertQueue {
  maxPriority?: number
}

export interface RawAmqpMessage {
  content: Buffer
}

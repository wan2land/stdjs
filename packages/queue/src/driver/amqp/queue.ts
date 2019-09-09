import { Channel, Connection } from 'amqplib'

import { Priority, Queue, SendQueueOptions } from '../../interfaces/queue'
import { scalePriority } from '../../utils'
import { AmqpJob } from './job'


const DEFAULT_PRIORITY = Priority.Normal

const scale = scalePriority([0, 255], [0, 255])

const assertProps = {
  maxPriority: 255,
}

export class AmqpQueue<TPayload> implements Queue<TPayload> {

  public connection?: Connection

  public channel?: Channel

  public constructor(public connecting: Promise<Connection>, public queue = 'default') {
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close()
    }
    if (this.connection) {
      await this.connection.close()
    } else {
      await (await this.connecting).close()
    }
  }

  public async getChannel(): Promise<Channel> {
    if (!this.channel) {
      this.connection = await this.connecting
      this.channel = await this.connection.createChannel()
    }
    await this.channel.assertQueue(this.queue, assertProps)
    return this.channel
  }

  public async countWaiting(): Promise<number> {
    const channel = await this.getChannel()
    const result = await channel.assertQueue(this.queue, assertProps)
    return result.messageCount
  }

  public countRunning(): Promise<number> {
    throw new Error('unsupport count running jobs')
  }

  public async flush(): Promise<void> {
    const channel = await this.getChannel()
    await channel.purgeQueue(this.queue)
  }

  public async send(payload: TPayload, options?: SendQueueOptions): Promise<void> {
    const channel = await this.getChannel()
    await channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(payload)), {
      priority: scale(options && options.priority || DEFAULT_PRIORITY),
    })
  }

  public async receive(): Promise<AmqpJob<TPayload> | undefined> {
    const channel = await this.getChannel()
    const message = await channel.get(this.queue)
    if (message) {
      try {
        const payload = JSON.parse(message.content.toString())
        return new AmqpJob(this, message, payload)
      } catch (e) {
        if (e instanceof SyntaxError) {
          return new AmqpJob(this, message, message.content.toString() as any)
        }
        throw e
      }
    }
  }

  public async delete(job: AmqpJob<TPayload>): Promise<void> {
    const channel = await this.getChannel()
    channel.ack(job.message)
    job.isDeleted = true
  }
}

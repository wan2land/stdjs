
import { Priority, Queue, SendQueueOptions } from "../../interfaces/queue"
import { priorityScale } from "../../utils"
import { RawAmqpChannel, RawAmqpConnection } from "./interfaces"
import { AmqpJob } from "./job"

const DEFAULT_PRIORITY = Priority.Normal

const scale = priorityScale([0, 255], [0, 255])

export class AmqpQueue<P> implements Queue<P> {

  public connection?: RawAmqpConnection

  public channel?: RawAmqpChannel

  constructor(public connecting: Promise<RawAmqpConnection>, public queue = "default") {
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

  public async getChannel(): Promise<RawAmqpChannel> {
    if (!this.channel) {
      this.connection = await this.connecting
      this.channel = await this.connection.createChannel()
      await this.channel.assertQueue(this.queue, {
        maxPriority: 255,
      })
    }
    return this.channel
  }

  public async flush(): Promise<void> {
    const channel = await this.getChannel()
    await channel.purgeQueue(this.queue)
  }

  public async send(payload: P, options?: SendQueueOptions): Promise<void> {
    const channel = await this.getChannel()
    await channel.sendToQueue(this.queue, new Buffer(JSON.stringify(payload)), {
      priority: scale((options && options.priority) || DEFAULT_PRIORITY),
    })
  }

  public async receive(): Promise<AmqpJob<P> | undefined> {
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
    return
  }

  public async delete(job: AmqpJob<P>): Promise<void> {
    const channel = await this.getChannel()
    channel.ack(job.message)
    job.isDeleted = true
  }
}

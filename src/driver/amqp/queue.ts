
import { Channel, Connection } from "amqplib"
import { Queue, SendQueueOptions } from "../../interfaces/queue"
import { AmqpJob } from "./job"

const DEFAULT_PRIORITY = 10

export class AmqpQueue<P> implements Queue<P> {

  public connection?: Connection

  public channel?: Channel

  constructor(public connecting: Promise<Connection>, public queue = "default") {
  }

  public async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close()
    }
  }

  public async getChannel(): Promise<Channel> {
    if (!this.channel) {
      this.connection = await this.connecting
      this.channel = await this.connection.createChannel()
      await this.channel.assertQueue(this.queue)
    }
    return this.channel
  }

  public async flush(): Promise<boolean> {
    const channel = await this.getChannel()
    try {
      await channel.purgeQueue(this.queue)
      return true
    } catch (e) {
      return false
    }
  }

  public async send(payload: P, options?: SendQueueOptions): Promise<boolean> {
    const channel = await this.getChannel()
    await channel.sendToQueue(this.queue, new Buffer(JSON.stringify(payload)), {
      priority: (options && options.priority) || DEFAULT_PRIORITY,
    })
    return true
  }

  public async receive(): Promise<AmqpJob<P> | undefined> {
    const channel = await this.getChannel()
    const message = await channel.get(this.queue)
    if (message) {
      const payload = JSON.parse(message.content.toString())
      return new AmqpJob(this, message, payload)
    }
    return
  }

  public async delete(job: AmqpJob<P>): Promise<boolean> {
    const channel = await this.getChannel()
    channel.ack(job.message)
    job.isDeleted = true
    return true
  }
}

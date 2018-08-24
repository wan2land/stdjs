
import { Queue, SendQueueOptions } from "../../interfaces/queue"
import { BeanstalkdJob } from "./job"

const DEFAULT_PRIORITY = 1024
const DEFAULT_DELAY = 0
const DEFAULT_TTR = 1

export class BeanstalkdQueue<P> implements Queue<P> {

  public isConnected = false

  constructor(public client: any, public tube = "default") {
  }

  public async close(): Promise<void> {
    await this.client.quit()
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return
    }
    if (!this.client.connection) {
      await this.client.connect()
    }
    await this.client.use(this.tube)
    this.isConnected = true
  }

  public async flush(): Promise<boolean> {
    await this.connect()
    let error = null
    do {
      error = null
      try {
        const res = await this.client.peekReady()
        await this.client.delete(res[0])
      } catch (e) {
        error = e
      }
    } while (!error)
    return true
  }

  public async send(payload: P, options?: SendQueueOptions): Promise<boolean> {
    await this.connect()
    await this.client.put(
      (options && options.priority) || DEFAULT_PRIORITY,
      (options && options.delay) || DEFAULT_DELAY,
      DEFAULT_TTR,
      JSON.stringify(payload)
    )
    return true
  }

  public async receive(): Promise<BeanstalkdJob<P> | undefined> {
    await this.connect()
    await this.client.watch(this.tube)
    try {
      const [id, buff] = await this.client.reserveWithTimeout(0)
      return new BeanstalkdJob(id, this, JSON.parse(buff))
    } catch (e) {
      if (e.message === "TIMED_OUT") {
        return
      }
      throw e
    }
  }

  public async delete(job: BeanstalkdJob<P>): Promise<boolean> {
    await this.connect()
    await this.client.delete(job.id)
    job.isDeleted = true
    return true
  }
}

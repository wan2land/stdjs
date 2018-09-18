
import { Priority, Queue, SendQueueOptions } from "../../interfaces/queue"
import { priorityScale } from "../../utils"
import { BeanstalkdJob } from "./job"

const DEFAULT_PRIORITY = Priority.Normal
const DEFAULT_DELAY = 0
const DEFAULT_TTR = 1

const scale = priorityScale([0, 255], [255, 0])

export class BeanstalkdQueue<P> implements Queue<P> {

  public isConnected = false

  constructor(public client: any, public tube = "default") {
  }

  public async close(): Promise<void> {
    await this.client.quit()
  }

  public async countWaiting(): Promise<number> {
    const stats = await this.client.stats()
    if (stats["current-jobs-ready"]) {
      return parseInt(stats["current-jobs-ready"], 10)
    }
    throw new Error("cannot count waiting jobs")
  }

  public async countRunning(): Promise<number> {
    const stats = await this.client.stats()
    if (stats["current-jobs-reserved"]) {
      return parseInt(stats["current-jobs-reserved"], 10)
    }
    throw new Error("cannot count running jobs")
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

  public async flush(): Promise<void> {
    await this.connect()
    while (1) {
      try {
        const res = await this.client.peekReady()
        await this.client.delete(res[0])
      } catch (e) {
        if (e.message === "NOT_FOUND") {
          break
        }
        throw e
      }
    }
  }

  public async send(payload: P, options?: SendQueueOptions): Promise<void> {
    await this.connect()
    await this.client.put(
      scale((options && options.priority) || DEFAULT_PRIORITY),
      (options && options.delay) || DEFAULT_DELAY,
      DEFAULT_TTR,
      JSON.stringify(payload)
    )
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

  public async delete(job: BeanstalkdJob<P>): Promise<void> {
    await this.connect()
    await this.client.delete(job.id)
    job.isDeleted = true
  }
}

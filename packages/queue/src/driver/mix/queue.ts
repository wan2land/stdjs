
import { Job, Priority, Queue, SendQueueOptions } from "../../interfaces/queue"

const DEFAULT_PRIORITY = Priority.Normal

export class MixQueue<P> implements Queue<P> {

  public queues: Array<{queue: Queue<P>, priority: number}>

  constructor(queues: Array<{queue: Queue<P>, priority: number}>) {
    this.queues = queues.sort(({priority: a}, {priority: b}) => {
      if (a === b) {
        return 0
      }
      return a < b ? 1 : -1
    })
  }

  public async countWaiting(): Promise<number> {
    const waitings = await Promise.all(this.queues.map(({queue}) => {
      return queue.countWaiting()
    }))
    return waitings.reduce((carry, waiting) => carry + waiting, 0)
  }

  public async countRunning(): Promise<number> {
    const runnings = await Promise.all(this.queues.map(({queue}) => {
      return queue.countRunning()
    }))
    return runnings.reduce((carry, running) => carry + running, 0)
  }

  public async close(): Promise<void> {
    await Promise.all(this.queues.map(({queue}) => {
      return queue.close()
    }))
  }

  public async flush(): Promise<void> {
    await Promise.all(this.queues.map(({queue}) => {
      return queue.flush()
    }))
  }

  public async send(payload: P, options?: SendQueueOptions): Promise<void> {
    if (this.queues.length === 0) {
      throw new Error("cannot send!")
    }
    const priority = (options && options.priority) || DEFAULT_PRIORITY
    for (const pair of this.queues) {
      if (pair.priority <= priority) {
        pair.queue.send(payload, {
          delay: (options && options.delay) || undefined,
        })
        return
      }
    }
    // last
    this.queues[this.queues.length - 1].queue.send(payload, {
      delay: (options && options.delay) || undefined,
    })
  }

  public async receive(): Promise<Job<P> | undefined> {
    for (const {queue} of this.queues) {
      const job = await queue.receive()
      if (job) {
        return job
      }
    }
    return undefined
  }

  public delete(job: Job<P>): Promise<void> {
    return job.done()
  }
}

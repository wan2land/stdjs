
import { Queue, SendQueueOptions } from "../../interfaces/queue"
import { LocalJob } from "./job"

export class LocalQueue<P> implements Queue<P> {

  public jobs: Array<LocalJob<P>> = []

  public runningJobs: Array<LocalJob<P>> = []

  constructor(public timeout = 6000) {
  }

  public async countWaiting(): Promise<number> {
    return this.jobs.length
  }

  public async countRunning(): Promise<number> {
    return this.runningJobs.length
  }

  public async close(): Promise<void> {
    //
  }

  public async flush(): Promise<void> {
    this.jobs = []
  }

  public async send(payload: P, options?: SendQueueOptions): Promise<void> {
    const job = new LocalJob(this, payload)
    if (options && options.delay) {
      setTimeout(() => {
        this.jobs.push(job)
      }, options.delay)
    } else {
      this.jobs.push(job)
    }
  }

  public async receive(): Promise<LocalJob<P> | undefined> {
    const job = this.jobs.shift()
    if (job) {
      this.runningJobs.push(job)
      job.timer = setTimeout(() => {
        const indexJob = this.runningJobs.indexOf(job)
        if (indexJob > -1) {
          delete job.timer
          this.runningJobs.splice(indexJob, 1)
          this.jobs.push(job) // not completed, re-push to queue.
        }
      }, this.timeout)
    }
    return job
  }

  public async delete(job: LocalJob<P>): Promise<void> {
    const index = this.runningJobs.indexOf(job)
    if (job.timer) {
      clearTimeout(job.timer) // clear timeout :-)
      delete job.timer
    }
    if (index > -1) {
      this.runningJobs.splice(index, 1)
    }
    job.isDeleted = true
  }
}


import { Queue, SendQueueOptions } from '../../interfaces/queue'
import { LocalJob } from './job'

export class LocalQueue<TPayload> implements Queue<TPayload> {

  public jobs: LocalJob<TPayload>[] = []

  public runningJobs: LocalJob<TPayload>[] = []

  public constructor(public timeout = 6000) {
  }

  public countWaiting(): Promise<number> {
    return Promise.resolve(this.jobs.length)
  }

  public countRunning(): Promise<number> {
    return Promise.resolve(this.runningJobs.length)
  }

  public close(): Promise<void> {
    return Promise.resolve()
  }

  public flush(): Promise<void> {
    this.jobs = []
    return Promise.resolve()
  }

  public send(payload: TPayload, options?: SendQueueOptions): Promise<void> {
    const job = new LocalJob(this, payload)
    if (options && options.delay) {
      setTimeout(() => {
        this.jobs.push(job)
      }, options.delay)
    } else {
      this.jobs.push(job)
    }
    return Promise.resolve()
  }

  public receive(): Promise<LocalJob<TPayload> | undefined> {
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
    return Promise.resolve(job)
  }

  public delete(job: LocalJob<TPayload>): Promise<void> {
    const index = this.runningJobs.indexOf(job)
    if (job.timer) {
      clearTimeout(job.timer) // clear timeout :-)
      delete job.timer
    }
    if (index > -1) {
      this.runningJobs.splice(index, 1)
    }
    job.isDeleted = true
    return Promise.resolve()
  }
}

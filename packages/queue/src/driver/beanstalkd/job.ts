
import { Job } from '../../interfaces/queue'
import { BeanstalkdQueue } from './queue'

export class BeanstalkdJob<TPayload> implements Job<TPayload> {

  public isDeleted = false

  public constructor(public id: string, public queue: BeanstalkdQueue<TPayload>, public payload: TPayload) {
  }

  public done(): Promise<void> {
    return this.queue.delete(this)
  }
}

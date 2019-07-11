
import { Job } from '../../interfaces/queue'
import { LocalQueue } from './queue'

export class LocalJob<TPayload> implements Job<TPayload> {

  public isDeleted = false

  public timer?: NodeJS.Timer

  public constructor(public queue: LocalQueue<TPayload>, public payload: TPayload) {
  }

  public done(): Promise<void> {
    return this.queue.delete(this)
  }
}

import { Job, Queue } from '../../interfaces/queue'


export class SqsJob<TPayload> implements Job<TPayload> {

  public isDeleted = false

  public constructor(public url: string, public id: string, public queue: Queue<TPayload>, public payload: TPayload) {
  }

  public done(): Promise<void> {
    return this.queue.delete(this)
  }
}

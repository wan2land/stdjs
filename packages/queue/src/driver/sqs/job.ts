
import { Job, Queue } from "../../interfaces/queue"

export class SqsJob<P> implements Job<P> {

  public isDeleted = false

  constructor(public url: string, public id: string, public queue: Queue<P>, public payload: P) {
  }

  public done(): Promise<void> {
    return this.queue.delete(this)
  }
}


import { Job } from "../../interfaces/queue"
import { LocalQueue } from "./queue"

export class LocalJob<P> implements Job<P> {

  public isDeleted = false

  constructor(public queue: LocalQueue<P>, public payload: P) {
  }

  public delete(): Promise<boolean> {
    return this.queue.delete(this)
  }
}

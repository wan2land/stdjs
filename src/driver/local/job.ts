
import { Job } from "../../interfaces/queue"
import { LocalQueue } from "./queue"

export class LocalJob<P> implements Job<P> {

  public isDeleted = false

  public timer?: NodeJS.Timer

  constructor(public queue: LocalQueue<P>, public payload: P) {
  }

  public done(): Promise<void> {
    return this.queue.delete(this)
  }
}


import { Message } from "amqplib"
import { Job } from "../../interfaces/queue"
import { AmqpQueue } from "./queue"

export class AmqpJob<P> implements Job<P> {

  public isDeleted = false

  constructor(public queue: AmqpQueue<P>, public message: Message, public payload: P) {
  }

  public done(): Promise<void> {
    return this.queue.delete(this)
  }
}

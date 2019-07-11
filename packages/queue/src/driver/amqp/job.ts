
import { Job } from '../../interfaces/queue'
import { RawAmqpMessage as Message } from './interfaces'
import { AmqpQueue } from './queue'

export class AmqpJob<TPayload> implements Job<TPayload> {

  public isDeleted = false

  public constructor(public queue: AmqpQueue<TPayload>, public message: Message, public payload: TPayload) {
  }

  public done(): Promise<void> {
    return this.queue.delete(this)
  }
}

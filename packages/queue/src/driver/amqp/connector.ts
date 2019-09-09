import { connect, Options } from 'amqplib'

import { Connector, Queue } from '../../interfaces/queue'
import { AmqpQueue } from './queue'

export class AmqpConnector implements Connector {

  public constructor(public options: Options.Connect & { queue: string }) {
  }

  public connect<TPayload>(): Queue<TPayload> {
    const { queue, ...options } = this.options
    return new AmqpQueue<TPayload>(connect(options), queue)
  }
}

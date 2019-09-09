import { Connector, Queue } from '../../interfaces/queue'
import { BeanstalkdQueueOptions } from './interfaces'
import { BeanstalkdQueue } from './queue'

const Beanstalkd = require('beanstalkd').default // eslint-disable-line @typescript-eslint/no-require-imports

export class BeanstalkdConnector implements Connector {

  public constructor(public options: BeanstalkdQueueOptions) {
  }

  public connect<TPayload>(): Queue<TPayload> {
    return new BeanstalkdQueue<TPayload>(
      new Beanstalkd(this.options.host || 'localhost', this.options.port || 11300),
      this.options.tube
    )
  }
}

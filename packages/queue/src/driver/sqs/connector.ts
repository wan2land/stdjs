import { SQS } from 'aws-sdk'

import { Connector, Queue } from '../../interfaces/queue'
import { SqsQueue } from './queue'


export class SqsConnector implements Connector {

  public constructor(public options: SQS.ClientConfiguration & { url: string }) {
  }

  public connect<TPayload>(): Queue<TPayload> {
    const { url, ...options } = this.options
    return new SqsQueue<TPayload>(new SQS(options), url)
  }
}

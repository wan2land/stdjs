import { createQueue } from './create-queue'
import { Connector, Queue } from './interfaces/queue'
import { MixQueue } from './mix-queue'

export interface MixQueueConnector {
  priority: number
  connector: Connector
}

export function createMixQueue<TPayload = any>(connectors: MixQueueConnector[]): Queue<TPayload> {
  return new MixQueue(connectors.map(({ priority, connector }) => {
    return {
      priority,
      queue: createQueue(connector),
    }
  }))
}

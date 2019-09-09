import { Connector, Queue } from './interfaces/queue'
import { LocalQueue } from './driver/local/queue'

export function createQueue<TPayload = any>(connector?: Connector): Queue<TPayload> {
  if (!connector) {
    return new LocalQueue()
  }
  return connector.connect<TPayload>()
}

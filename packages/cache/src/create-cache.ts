import { LocalCache } from './driver/local/cache'
import { Cache, Connector } from './interfaces/cache'


export function createCache(connector?: Connector): Cache {
  if (!connector) {
    return new LocalCache()
  }
  return connector.connect()
}

import Memcached from 'memcached'

import { Cache, Connector } from '../../interfaces/cache'
import { MemcachedCache } from './cache'
import { MemcachedConnectorOptions } from './interfaces'

export class MemcachedConnector implements Connector {

  public constructor(public options: MemcachedConnectorOptions) {
  }

  public connect(): Cache {
    const { location, ...options } = this.options
    return new MemcachedCache(new Memcached(location, options))
  }
}

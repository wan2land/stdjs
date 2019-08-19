import { ClientOpts, createClient } from 'redis'

import { Cache, Connector } from '../../interfaces/cache'
import { RedisCache } from './cache'

export class RedisConnector implements Connector {

  public constructor(public options: ClientOpts) {
  }

  public connect(): Cache {
    return new RedisCache(createClient(this.options))
  }
}

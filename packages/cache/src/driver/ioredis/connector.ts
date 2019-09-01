import Redis, { RedisOptions } from 'ioredis'

import { Cache, Connector } from '../../interfaces/cache'
import { IORedisCache } from './cache'

export class IORedisConnector implements Connector {

  public constructor(public options: RedisOptions) {
  }

  public connect(): Cache {
    return new IORedisCache(new Redis(this.options))
  }
}

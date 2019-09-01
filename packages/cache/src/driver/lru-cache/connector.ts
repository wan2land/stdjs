import Lru, { Options } from 'lru-cache'

import { Cache, Connector } from '../../interfaces/cache'
import { LruCache } from './cache'

export class LruCacheConnector implements Connector {

  public constructor(public options: Options<any, any>) {
  }

  public connect(): Cache {
    return new LruCache(new Lru(this.options))
  }
}

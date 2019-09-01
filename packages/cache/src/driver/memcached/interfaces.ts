import Memcached from 'memcached'


export interface MemcachedConnectorOptions extends Memcached.options {
  location: Memcached.Location
}

# STDJS - Cache

[![Downloads](https://img.shields.io/npm/dt/@stdjs/cache.svg?style=flat-square)](https://npmcharts.com/compare/@stdjs/cache?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/cache.svg?style=flat-square)](https://www.npmjs.com/package/@stdjs/cache)
[![License](https://img.shields.io/npm/l/@stdjs/cache.svg?style=flat-square)](https://www.npmjs.com/package/@stdjs/cache)
![Typescript](https://img.shields.io/npm/types/@stdjs/cache.svg?style=flat-square)

Cache Adapter with Async/Promise for Javascript(& Typescript).

There are a lot of cache libraries. Even older libraries may not support **Promise**. I've gathered most cache libraries into one interface.

## Installation

```bash
npm install @stdjs/cache --save
```

## Support Cache

- local
- memcached
  - `npm install memcached --save` (in typescript `npm install @types/memcached -D`)
- ioredis
  - `npm install ioredis --save`
- redis
  - `npm install redis --save` (in typescript `npm install @types/redis -D`)
- lru-cache
  - `npm install lru-cache --save` (in typescript `npm install @types/lru-cache -D`)

## Interfaces

```typescript
export interface Connector {
  connect(): Cache
}

export interface Cache {
  close(): Promise<boolean>
  get<T>(key: string, defaultValue?: T): Promise<T | undefined>
  set<T>(key: string, value: T, ttl?: number): Promise<boolean> // ttl unit is `seconds`
  has(key: string): Promise<boolean>
  delete(key: string): Promise<boolean>
  clear(): Promise<boolean>
}
```

## Usage

You can create as follows:

(Please refer to the Config section for config.)

```javascript
const cache = require("@stdjs/cache")
const storage = cache.createCache(/* Connector */)

// or
import { createCache } from "@stdjs/cache"
const storage = createCache(/* Connector */)
```

### Create Local Cache

```ts
const storage = createCache()
```

### Create Memcached Cache

Memcached's ttl has a maximum value of 30 days. Even if you do not specify ttl, it is automatically set to 30 days.

- [memcached: location options](https://www.npmjs.com/package/memcached#server-locations)
- [memcached: cache options](https://github.com/3rd-Eden/memcached#options).

```ts
import { createCache } from "@stdjs/cache" 
import { MemcachedConnector } from '@stdjs/cache/lib/driver/memcached'

const storage = createCache(new MemcachedConnector({
  // https://www.npmjs.com/package/memcached#server-locations
  location, // like, "127.0.0.1:11211", ["127.0.0.1:11211", "127.0.0.1:11212"] ...

  // https://www.npmjs.com/package/memcached#options
  ...options,
}))
```

### Create Redis Cache

- [redis: cache options](https://www.npmjs.com/package/redis#rediscreateclient).

```ts
import { createCache } from "@stdjs/cache" 
import { RedisConnector } from '@stdjs/cache/lib/driver/redis'

const storage = createCache(new RedisConnector({
  ...options,
}))
```

### Create IORedis Cache

- [ioredis: cache options](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options).

```ts
import { createCache } from "@stdjs/cache" 
import { IORedisConnector } from '@stdjs/cache/lib/driver/ioredis'

const storage = createCache(new IORedisConnector({
  ...options,
}))
```

### Create Lru Cache

- [lru-cache: node lru cache options](https://github.com/isaacs/node-lru-cache#options).

```ts
import { createCache } from "@stdjs/cache" 
import { LruCacheConnector } from '@stdjs/cache/lib/driver/lru-cache'

const storage = createCache(new LruCacheConnector({
  ...options,
}))
```

## License

MIT

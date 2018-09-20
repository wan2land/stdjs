# STDJS - Cache

[![Build](https://travis-ci.org/corgidisco/stdjs-cache.svg?branch=master)](https://travis-ci.org/corgidisco/stdjs-cache)
[![Downloads](https://img.shields.io/npm/dt/@stdjs/cache.svg)](https://npmcharts.com/compare/@stdjs/cache?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/cache.svg)](https://www.npmjs.com/package/@stdjs/cache)

[![dependencies Status](https://david-dm.org/corgidisco/stdjs-cache/status.svg)](https://david-dm.org/corgidisco/stdjs-cache)
[![devDependencies Status](https://david-dm.org/corgidisco/stdjs-cache/dev-status.svg)](https://david-dm.org/corgidisco/stdjs-cache?type=dev)

[![License](https://img.shields.io/npm/l/@stdjs/cache.svg)](https://www.npmjs.com/package/@stdjs/cache)

[![NPM](https://nodeico.herokuapp.com/@stdjs/cache.svg)](https://www.npmjs.com/package/@stdjs/cache)

Cache Adapter with Async/Promise for Javascript(& Typescript).

There are a lot of cache libraries. Even older libraries may not support **Promise**. I've gathered most cache libraries into one interface.

## Installation

```bash
npm install @stdjs/cache --save
```

## Support Cache

- local
- memcached (require `npm install memcached --save`)
- redis (require `npm install redis --save`)

## Interfaces

```typescript
export interface Cache {
  close(): Promise<boolean>
  get<P>(key: string, defaultValue?: P): Promise<P | undefined>
  set<P>(key: string, value: P, ttl?: number): Promise<boolean> // ttl unit is `seconds`
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
const storage = cache.create({
  adapter: "local"
  /* config */
})

// or
import { create } from "@stdjs/cache"
const storage = create({
  adapter: "local"
  /* config */
})
```

### Create Local Cache

```ts
const storage = create({
  adapter: "local",
})
```

### Create Memcached Cache

Memcached's ttl has a maximum value of 30 days. Even if you do not specify ttl, it is automatically set to 30 days.

```ts
const storage = create({
  adapter: "memcached",

  // https://www.npmjs.com/package/memcached#server-locations
  location, // like, "127.0.0.1:11211", ["127.0.0.1:11211", "127.0.0.1:11212"] ...

  // https://www.npmjs.com/package/memcached#options
  ...options,
})
```

### Create Redis Cache

```ts
const storage = create({
  adapter: "redis",

  // https://www.npmjs.com/package/redis#rediscreateclient
  ...options,
})
```

## License

MIT

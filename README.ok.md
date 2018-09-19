# STDJS - Cache

[![Downloads](https://img.shields.io/npm/dt/@stdjs/cache.svg)](https://npmcharts.com/compare/@stdjs/cache?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/cache.svg)](https://www.npmjs.com/package/@stdjs/cache)
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

@code("src/interfaces/cache.ts@interface", "typescript")

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

@code("test/readme.test.ts@create-local")

### Create Memcached Cache

Memcached's ttl has a maximum value of 30 days. Even if you do not specify ttl, it is automatically set to 30 days.

@code("test/readme.test.ts@create-memcached")

### Create Redis Cache

@code("test/readme.test.ts@create-redis")

## License

MIT

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
- (todo) memcached
- (todo) redis

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

## License

MIT

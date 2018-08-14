# Async Queue Adapter

[![Build](https://travis-ci.org/corgidisco/async-queue-adapter.svg?branch=master)](https://travis-ci.org/corgidisco/async-queue-adapter)
[![Downloads](https://img.shields.io/npm/dt/async-queue-adapter.svg)](https://npmcharts.com/compare/async-queue-adapter?minimal=true)
[![Version](https://img.shields.io/npm/v/async-queue-adapter.svg)](https://www.npmjs.com/package/async-queue-adapter)
[![License](https://img.shields.io/npm/l/async-queue-adapter.svg)](https://www.npmjs.com/package/async-queue-adapter)

[![NPM](https://nodei.co/npm/async-queue-adapter.png)](https://www.npmjs.com/package/async-queue-adapter)

Async Queue Adapter for Javascript(& Typescript).

## Installation

```bash
npm install async-queue-adapter --save
```

## Usage

You can create as follows:

(Please refer to the Config section for config.)

```javascript
const connection = require("async-queue-adapter").create({
  adapter: "local"
  /* config */
})

// or
import { create } from "async-queue-adapter"
create({
  adapter: "local"
  /* config */
})
```

### Support Queue

- local
- sqs (require `npm install aws-sdk --save`)
- beanstalkd (todo)

### Create Connection

Use `adapter` parameter of `create` function`s config

### Support Options

| adapter      | delays        | priority | timeout        |
|--------------|---------------|----------|----------------|
| `local`      | O             | ..todo.. | O              |
| `sqs`        | O (Max 15min) | Never    | By AWS Console |

## License

MIT

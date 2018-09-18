# STDJS - Queue

[![Downloads](https://img.shields.io/npm/dt/@stdjs/queue.svg)](https://npmcharts.com/compare/@stdjs/queue?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/queue.svg)](https://www.npmjs.com/package/@stdjs/queue)
[![License](https://img.shields.io/npm/l/@stdjs/queue.svg)](https://www.npmjs.com/package/@stdjs/queue)

[![NPM](https://nodei.co/npm/@stdjs/queue.png)](https://www.npmjs.com/package/@stdjs/queue)

Queue Adapter with Async/Promise for Javascript(& Typescript).

## Installation

```bash
npm install @stdjs/queue --save
```

## Usage

You can create as follows:

(Please refer to the Config section for config.)

```javascript
const connection = require("@stdjs/queue").create({
  adapter: "local"
  /* config */
})

// or
import { create } from "@stdjs/queue"
create({
  adapter: "local"
  /* config */
})
```

### Support Queue

- local
- AWS, SQS (require `npm install aws-sdk --save`)
- beanstalkd (require `npm install beanstalkd --save`)
- amqp (such as, RabbitMQ) (require `npm install amqplib --save`)

### Create Connection

Use `adapter` parameter of `create` function`s config

### Support Options

| adapter      | delays        | priority | timeout        |
|--------------|---------------|----------|----------------|
| `local`      | O             | ..todo.. | O              |
| `aws-sdk`    | O (Max 15min) |          | By AWS Console |
| `beanstalkd` | O             | O        |                |
| `amqplib`    |               | O        |                |

## License

MIT

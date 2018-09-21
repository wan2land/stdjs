# STDJS - Queue

[![Downloads](https://img.shields.io/npm/dt/@stdjs/queue.svg)](https://npmcharts.com/compare/@stdjs/queue?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/queue.svg)](https://www.npmjs.com/package/@stdjs/queue)
[![License](https://img.shields.io/npm/l/@stdjs/queue.svg)](https://www.npmjs.com/package/@stdjs/queue)

[![NPM](https://nodeico.herokuapp.com/@stdjs/queue.svg)](https://www.npmjs.com/package/@stdjs/queue)

Queue Adapter with Async/Promise for Javascript(& Typescript).

There are a lot of Queue libraries. Even older libraries may not support **Promise**. I've gathered most queue libraries into one interface.

## Installation

```bash
npm install @stdjs/queue --save
```

## Support Queue

- local
- AWS, SQS (require `npm install aws-sdk --save`)
- beanstalkd (require `npm install beanstalkd --save`)
- AMQP (such as, RabbitMQ) (require `npm install amqplib --save`)
- (TODO) mix (Mix multiple queues for use Priority)

### Support Options

adapter | delays | priority | timeout
--- | --- | --- | ---
`local` | O | X (use `mix` adapter) | O
`aws-sdk` | O ([Max 15min](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html)) | X (use `mix` adapter) | [By AWS Console](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html#changing-message-visibility-timeout)
`beanstalkd` | O | O | X
`amqplib` | X | O | X |
`mix` | Case by case | O | Case by case

## Interfaces

```typescript
export enum Priority {
  Normal = 10,
  High = 30,
  Highest = 50,
}

export interface Queue<P> {
  close(): Promise<void>
  countWaiting(): Promise<number>
  countRunning(): Promise<number>
  flush(): Promise<void>
  send(payload: P, options?: SendQueueOptions): Promise<void>
  receive(): Promise<Job<P> | undefined>
  delete(job: Job<P>): Promise<void>
}

export interface SendQueueOptions {
  delay?: number
  priority?: number
}

export interface Job<P> {
  payload: P
  queue: Queue<P>
  isDeleted: boolean
  done(): Promise<void>
}
```

## Usage

You can create as follows:

(Please refer to the Config section for config.)

```javascript
const queue = require("@stdjs/queue")
const connection = queue.create({
  adapter: "local",
  /* config */
})

// or
import { create } from "@stdjs/queue"
create({
  adapter: "local",
  /* config */
})
```

### Create Connection

Use `adapter` parameter of `create` function`s config

## License

MIT

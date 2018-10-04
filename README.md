# STDJS - Queue

[![Downloads](https://img.shields.io/npm/dt/@stdjs/queue.svg)](https://npmcharts.com/compare/@stdjs/queue?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/queue.svg)](https://www.npmjs.com/package/@stdjs/queue)
[![License](https://img.shields.io/npm/l/@stdjs/queue.svg)](https://www.npmjs.com/package/@stdjs/queue)

[![dependencies Status](https://david-dm.org/corgidisco/stdjs-queue/status.svg)](https://david-dm.org/corgidisco/stdjs-queue)
[![devDependencies Status](https://david-dm.org/corgidisco/stdjs-queue/dev-status.svg)](https://david-dm.org/corgidisco/stdjs-queue?type=dev)

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
- mix (Mix multiple queues for use Priority)

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

### Create Local Queue

```ts
const connection = create({
  adapter: "local",

  // https://github.com/corgidisco/stdjs-queue/blob/master/src/driver/local/interfaces.ts
  ...options,
})
```

### Create Aws SQS Queue

```ts
const connection = create({
  adapter: "aws-sdk",

  // SQS URL
  url, // like "https://sqs.{region}.amazonaws.com/012345678910/your-sqs-name"

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property
  ...options,
})
```

### Create RabbitMQ(AMQP) Queue

```ts
const connection = create({
  adapter: "amqplib",

  // AMQP Queue Name
  queue, // like "amqp-queue-name",

  // http://www.squaremobius.net/amqp.node/channel_api.html#connecting-with-an-object-instead-of-a-url
  ...options,
})
```

### Create Beanstalkd Queue

```ts
const connection = create({
  adapter: "beanstalkd",

  // beanstalkd connection
  host, // default "localhost"
  port, // default 11300

  // tube name
  tube,
})
```

### Create Mix Queue

`mix` allows you to set the priority based on other default queues.

```ts
const connection = create({
  adapter: "mix",
  queues: [
    {
      priority: Priority.Highest, // Priority Highest is 50

      // The following options are the same as the Queue create options.
      adapter: "local",
      timeout: 100,
    },
    {
      priority: Priority.High, // Priority High is 30
      adapter: "local",
      timeout: 100,
    },
    {
      priority: Priority.Normal, // Priority Normal is 10
      adapter: "local",
      timeout: 100,
    },
  ],
})
```

## License

MIT

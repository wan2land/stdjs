# STDJS - Queue

[![Downloads](https://img.shields.io/npm/dt/@stdjs/queue.svg?style=flat-square)](https://npmcharts.com/compare/@stdjs/queue?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/queue.svg?style=flat-square)](https://www.npmjs.com/package/@stdjs/queue)
[![License](https://img.shields.io/npm/l/@stdjs/queue.svg?style=flat-square)](https://www.npmjs.com/package/@stdjs/queue)
![Typescript](https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square)

Queue Adapter with Async/Promise for Javascript(& Typescript).

There are a lot of Queue libraries. Even older libraries may not support **Promise**. I've gathered most queue libraries into one interface.

## Installation

```bash
npm install @stdjs/queue --save
```

## Support Queue

- local
- aws-sdk (SQS)
  - `npm install aws-sdk --save`
- beanstalkd
  - `npm install beanstalkd --save`
- amqplib (such as, RabbitMQ)
  - `npm install amqplib --save` (in typescript `npm install @types/amqplib -D`)

### Support Options

adapter | delays | priority | timeout
--- | --- | --- | ---
`local` | O | X (use `mix` adapter) | O
`aws-sdk` | O ([Max 15min](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html)) | X (use `mix` adapter) | [By AWS Console](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html#changing-message-visibility-timeout)
`beanstalkd` | O | O | X
`amqplib` | X | O | X |

## Interfaces

```typescript
export interface Connector {
  connect<TPayload>(): Queue<TPayload>
}

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
const storage = queue.createQueue(/* Connector */)

// or
import { createQueue } from "@stdjs/queue"
const storage = createQueue(/* Connector */)
```

### Create Local Queue

```ts
const connection = createQueue()
```

### Create Aws SQS Queue

- [aws-sek: SQS options](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property).

```ts
import { createQueue } from "@stdjs/queue" 
import { SqsConnector } from '@stdjs/queue/lib/driver/sqs'

const connection = createQueue(new SqsConnector({
  url, // SQS URL, ex. "https://sqs.{region}.amazonaws.com/012345678910/your-sqs-name"
  ...options,
}))
```

### Create RabbitMQ(AMQP) Queue

- [amqplib: options](http://www.squaremobius.net/amqp.node/channel_api.html#connecting-with-an-object-instead-of-a-url).

```ts
import { createQueue } from "@stdjs/queue" 
import { AmqpConnector } from '@stdjs/queue/lib/driver/amqp'

const connection = createQueue(new AmqpConnector({
  queue, // AMQP Queue Name, ex. "amqp-queue-name",
  ...options,
}))
```

### Create Beanstalkd Queue

```ts
import { createQueue } from "@stdjs/queue" 
import { BeanstalkdConnector } from '@stdjs/queue/lib/driver/beanstalkd'

const connection = createQueue(new BeanstalkdConnector({
  host, // Beanstalkd server host, default "localhost"
  port, // Beanstalkd server port, default 11300
  tube, // Tube name, 
}))
```

## License

MIT

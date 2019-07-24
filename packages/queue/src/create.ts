/* eslint-disable import/no-unresolved, @typescript-eslint/no-require-imports */

import { QueueConfig } from './interfaces/config'
import { Queue } from './interfaces/queue'

import { AmqpQueue } from './driver/amqp/queue'
import { BeanstalkdQueue } from './driver/beanstalkd/queue'
import { LocalQueue } from './driver/local/queue'
import { MixQueue } from './driver/mix/queue'
import { SqsQueue } from './driver/sqs/queue'

export function create<T>(config: QueueConfig): Queue<T> {
  if (config.adapter === 'local') {
    return new LocalQueue(config.timeout)
  } if (config.adapter === 'aws-sdk') {
    const { adapter: _, url, ...remainConfig } = config
    const aws = require('aws-sdk')
    return new SqsQueue(new aws.SQS(remainConfig), url)
  } if (config.adapter === 'beanstalkd') {
    const Beanstalkd = require('beanstalkd').default
    const beans = new Beanstalkd(config.host || 'localhost', config.port || 11300)
    return new BeanstalkdQueue(beans, config.tube)
  } if (config.adapter === 'amqplib') {
    const { adapter: _, queue, ...remainConfig } = config
    const amqp = require('amqplib')
    return new AmqpQueue<T>(amqp.connect(remainConfig), queue)
  } if (config.adapter === 'mix') {
    const { adapter: _, queues } = config
    return new MixQueue(queues.map(queueConfig => {
      const { priority, ...remains } = queueConfig
      return {
        priority,
        queue: create<T>(remains),
      }
    }))
  }
  throw new Error(`cannot resolve adapter named "${(config as any).adapter}"`)
}

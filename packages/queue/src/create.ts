
import { QueueConfig } from "./interfaces/config"
import { Queue } from "./interfaces/queue"

// drivers
import { AmqpQueue } from "./driver/amqp/queue"
import { BeanstalkdQueue } from "./driver/beanstalkd/queue"
import { LocalQueue } from "./driver/local/queue"
import { MixQueue } from "./driver/mix/queue"
import { SqsQueue } from "./driver/sqs/queue"

function isArrayOfConfig(config: any): config is QueueConfig[] {
  return Array.isArray(config)
}

function isMapOfConfig(config: any): config is {[name: string]: QueueConfig} {
  const keys = Object.keys(config)
  if (keys.length === 0) {
    return true
  }
  return !config.adapter && config[keys[0]].adapter
}

export function create<P>(config: QueueConfig): Queue<P> {
  if (config.adapter === "local") {
    return new LocalQueue(config.timeout)
  } else if (config.adapter === "aws-sdk") {
    const {adapter, url, ...remainConfig} = config
    const aws = require("aws-sdk")
    return new SqsQueue(new aws.SQS(remainConfig), url)
  } else if (config.adapter === "beanstalkd") {
    const Beanstalkd = require("beanstalkd").default
    const beans = new Beanstalkd(config.host || "localhost", config.port || 11300)
    return new BeanstalkdQueue(beans, config.tube)
  } else if (config.adapter === "amqplib") {
    const {adapter, queue, ...remainConfig} = config
    const amqp = require("amqplib")
    return new AmqpQueue(amqp.connect(remainConfig), queue)
  } else if (config.adapter === "mix") {
    const {adapter, queues} = config
    return new MixQueue(queues.map(queueConfig => {
      const {priority, ...remains} = queueConfig
      return {
        priority,
        queue: create<P>(remains),
      }
    }))
  }
  throw new Error(`cannot resolve adapter named "${(config as any).adapter}"`)
}

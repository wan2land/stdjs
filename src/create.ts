
import { QueueConfig } from "./interfaces/config"
import { Queue } from "./interfaces/queue"

// drivers
import { AmqpQueue } from "./driver/amqp/queue"
import { BeanstalkdQueue } from "./driver/beanstalkd/queue"
import { LocalQueue } from "./driver/local/queue"
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

export function create<P>(configs: QueueConfig[]): Array<Queue<P>>
export function create<P>(configs: {[name: string]: QueueConfig}): {[name: string]: Queue<P>}
export function create<P>(config: QueueConfig): Queue<P>
export function create(config: any): any {
  if (isArrayOfConfig(config)) {
    return config.map(conf => createQueue(conf))
  }
  if (isMapOfConfig(config)) {
    const connections: {[name: string]: Queue<{}>} = {}
    Object.keys(config).map((key) => {
      connections[key] = createQueue(config[key])
    })
    return connections
  }
  return createQueue(config)
}

function createQueue<P>(config: QueueConfig): Queue<P> {
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
  }
  throw new Error(`cannot resolve adapter named "${(config as any).adapter}"`)
}

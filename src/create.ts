
import { QueueConfig } from "./interfaces/config"
import { Queue } from "./interfaces/queue"

// drivers
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
    return config.map(conf => create(conf))
  }
  if (isMapOfConfig(config)) {
    const connections: {[name: string]: Queue<{}>} = {}
    Object.keys(config).map((key) => {
      connections[key] = create(config[key])
    })
    return connections
  }

  if (config.adapter === "local") {
    return new LocalQueue(config)
  } else if (config.adapter === "sqs") {
    const {adapter, url, ...remainConfig} = config
    const aws = require("aws-sdk")
    return new SqsQueue(new aws.SQS(remainConfig), url)
  }
  throw new Error(`cannot resolve adapter named "${config.adapter}"`)
}

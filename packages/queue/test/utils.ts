import { exec } from 'child_process'

import { Connector } from '../lib'
import { SqsConnector } from '../lib/driver/sqs'
import { AmqpConnector } from '../src/driver/amqp'
import { BeanstalkdConnector } from '../src/driver/beanstalkd'


function getDockerComposePort(service: string, port: number): Promise<[string, number]> {
  return new Promise((resolve, reject) => {
    exec(`docker-compose port ${service} ${port}`, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      const result = stdout.trim().split(':')
      resolve([result[0], parseInt(result[1], 10)])
    })
  })
}

export async function getConfig(testcase: string): Promise<Connector | undefined> {
  if (testcase === 'local') {
    return
  }
  if (testcase === 'sqs') {
    return new SqsConnector({
      region: process.env.AWS_SQS_REGION || '',
      url: process.env.AWS_SQS_URL || '',
    })
  }
  if (testcase === 'beanstalkd') {
    const port = await getDockerComposePort('beanstalkd', 11300)
    return new BeanstalkdConnector({
      host: 'localhost',
      port: port[1],
      tube: 'jest',
    })
  }
  if (testcase === 'rabbitmq') {
    const port = await getDockerComposePort('rabbitmq', 5672)
    return new AmqpConnector({
      queue: 'jest',
      port: port[1],
    })
  }
  throw new Error(`unknown testcase ${testcase}`)
}

export function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

import { exec } from 'child_process'

import { Connector } from '../lib'
import { IORedisConnector } from '../lib/driver/ioredis'
import { MemcachedConnector } from '../lib/driver/memcached'
import { RedisConnector } from '../lib/driver/redis'


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

export async function getConnector(testcase: string): Promise<Connector | undefined> {
  if (testcase === 'local') {
    return
  }
  if (testcase === 'memcached') {
    const port = await getDockerComposePort('memcached', 11211)
    return new MemcachedConnector({
      location: `127.0.0.1:${port[1]}`,
    })
  }
  if (testcase === 'ioredis') {
    const port = await getDockerComposePort('redis', 6379)
    return new IORedisConnector({
      host: '127.0.0.1',
      port: port[1],
    })
  }
  if (testcase === 'redis') {
    const port = await getDockerComposePort('redis', 6379)
    return new RedisConnector({
      host: '127.0.0.1',
      port: port[1],
    })
  }
  throw new Error(`unknown testcase ${testcase}`)
}

export function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

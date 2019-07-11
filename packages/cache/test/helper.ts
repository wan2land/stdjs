
import { exec } from "child_process"
import { CacheConfig } from "../lib"

function getDockerComposePort(service: string, port: number): Promise<[string, number]> {
  return new Promise((resolve, reject) => {
    exec(`docker-compose port ${service} ${port}`, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      const result = stdout.trim().split(":")
      resolve([result[0], parseInt(result[1], 10)])
    })
  })
}

export async function getConfig(testcase: string): Promise<CacheConfig> {
  if (testcase === "local") {
    return {
      adapter: "local",
    }
  } else if (testcase === "memcached") {
    const port = await getDockerComposePort("memcached", 11211)
    return {
      adapter: "memcached",
      location: `127.0.0.1:${port[1]}`,
    }
  } else if (testcase === "redis") {
    const port = await getDockerComposePort("redis", 6379)
    return {
      adapter: "redis",
      host: "127.0.0.1",
      port: port[1],
    }
  }
  throw new Error(`unknown testcase ${testcase}`)
}

export function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}


import { exec } from "child_process"
import { Priority, QueueConfig } from "../dist"

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

export async function getConfig(testcase: string): Promise<QueueConfig> {
  if (testcase === "local") {
    return {
      adapter: "local",
      timeout: 100,
    }
  } else if (testcase === "sqs") {
    return {
      adapter: "aws-sdk",
      region: process.env.AWS_SQS_REGION,
      url: process.env.AWS_SQS_URL,
    }
  } else if (testcase === "beanstalkd") {
    const port = await getDockerComposePort("beanstalkd", 11300)
    return {
      adapter: "beanstalkd",
      host: "localhost",
      port: port[1],
      tube: "jest",
    }
  } else if (testcase === "rabbitmq") {
    const port = await getDockerComposePort("rabbitmq", 5672)
    return {
      adapter: "amqplib",
      queue: "jest",
      port: port[1],
    }
  } else if (testcase === "mix") {
    return {
      adapter: "mix",
      queues: [
        {
          priority: Priority.Highest,
          adapter: "local",
          timeout: 100,
        },
        {
          priority: Priority.High,
          adapter: "local",
          timeout: 100,
        },
        {
          priority: Priority.Normal,
          adapter: "local",
          timeout: 100,
        },
      ],
    }
  }
  throw new Error(`unknown testcase ${testcase}`)
}

export function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

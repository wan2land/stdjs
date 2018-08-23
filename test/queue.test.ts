
import "jest"

import { create, QueueConfig } from "../dist"

require("dotenv").config(process.cwd()) // tslint:disable-line

const testcases = ["local", "beanstalkd"]
if (process.env.AWS_ACCESS_KEY_ID
  && process.env.AWS_SECRET_ACCESS_KEY
  && process.env.AWS_SQS_URL
  && process.env.AWS_SQS_REGION) {
  testcases.push("sqs")
}

const configs: {[testcase: string]: QueueConfig} = {
  local: {
    adapter: "local",
    timeout: 100,
  },
  sqs: {
    adapter: "aws-sdk",
    region: process.env.AWS_SQS_REGION,
    url: process.env.AWS_SQS_URL,
  },
  beanstalkd: {
    adapter: "beanstalkd",
    host: "localhost",
    tube: "jest",
  },
}

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe("queue", () => {
  testcases.forEach(testcase => {
    it(`test ${testcase} basic functions`, async () => {
      const queue = create(configs[testcase])
      await queue.flush()

      const messages = []

      for (let i = 0; i < 10; i++) {
        await queue.send(`message ${i}`)
        messages.push(`message ${i}`)
      }

      for (let i = 0; i < 10; i++) {
        const job = await queue.receive()
        const foundMessageKey = messages.indexOf(job.payload)
        messages.splice(foundMessageKey, 1)
        expect(foundMessageKey).toBeGreaterThan(-1)
        expect(job.isDeleted).toBeFalsy()

        if (i % 2 === 0) {
          await queue.delete(job)
        } else {
          await job.delete()
        }

        expect(job.isDeleted).toBeTruthy()
      }

      expect(messages.length).toEqual(0) // all spliced!
      await timeout(500)

      expect(await queue.receive()).toBeUndefined()

      queue.close()
    })

    if (["local"].indexOf(testcase) > -1) {
      it(`test ${testcase} timeout`, async () => {
        const queue = create(configs[testcase])
        await queue.flush()

        for (let i = 0; i < 10; i++) {
          await queue.send(`message ${i}`)
        }
        for (let i = 0; i < 10; i++) {
          const job = await queue.receive()
          if (i % 2 === 1) {
            await job.delete()
          }
        }

        await timeout(500)

        for (let i = 0; i < 5; i++) {
          const job = await queue.receive()
          expect(job.payload).toEqual(`message ${i * 2}`)
          await job.delete()
        }

        queue.close()
      })
    }
  })
})

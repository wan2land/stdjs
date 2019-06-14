
import "jest"

import { create, Priority, QueueConfig } from "../dist"
import { getConfig, timeout } from "./helper"

require("dotenv").config(process.cwd()) // tslint:disable-line

const testcases = ["local", "beanstalkd", "rabbitmq", "mix"]
if (process.env.AWS_ACCESS_KEY_ID
  && process.env.AWS_SECRET_ACCESS_KEY
  && process.env.AWS_SQS_URL
  && process.env.AWS_SQS_REGION) {
  // testcases.push("sqs")
}

describe("queue", () => {
  testcases.forEach(testcase => {
    it(`test ${testcase} basic functions`, async () => {
      const queue = create(await getConfig(testcase))
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
          await job.done()
        }

        expect(job.isDeleted).toBeTruthy()
      }

      expect(messages.length).toEqual(0) // all spliced!
      await timeout(500)

      expect(await queue.receive()).toBeUndefined()

      queue.close()
    })

    if (["local", "mix"].indexOf(testcase) > -1) {
      it(`test ${testcase} timeout`, async () => {
        const queue = create(await getConfig(testcase))
        await queue.flush()

        for (let i = 0; i < 10; i++) {
          await queue.send(`message ${i}`)
        }
        for (let i = 0; i < 10; i++) {
          const job = await queue.receive()
          if (i % 2 === 1) {
            await job.done()
          }
        }

        await timeout(500)

        for (let i = 0; i < 5; i++) {
          const job = await queue.receive()
          expect(job.payload).toEqual(`message ${i * 2}`)
          await job.done()
        }

        queue.close()
      })
    }

    if (["beanstalkd", "rabbitmq"].indexOf(testcase) > -1) {
      it(`test ${testcase} priority`, async () => {
        const producer = create(await getConfig(testcase))
        const consumer = create(await getConfig(testcase))
        await producer.flush()

        await producer.send(`message normal`, {priority: Priority.Normal})
        await producer.send(`message high`, {priority: Priority.High})
        await producer.send(`message highest`, {priority: Priority.Highest})
        producer.close()

        {
          const job = await consumer.receive()
          expect(job.payload).toEqual(`message highest`)
          await job.done()
        }
        {
          const job = await consumer.receive()
          expect(job.payload).toEqual(`message high`)
          await job.done()
        }
        {
          const job = await consumer.receive()
          expect(job.payload).toEqual(`message normal`)
          await job.done()
        }

        consumer.close()
      })
    }

    if (["mix"].indexOf(testcase) > -1) {
      it(`test ${testcase} priority`, async () => {
        const queue = create(await getConfig(testcase))
        await queue.flush()

        await queue.send(`message normal`, {priority: Priority.Normal})
        await queue.send(`message high`, {priority: Priority.High})
        await queue.send(`message highest`, {priority: Priority.Highest})

        {
          const job = await queue.receive()
          expect(job.payload).toEqual(`message highest`)
          await job.done()
        }
        {
          const job = await queue.receive()
          expect(job.payload).toEqual(`message high`)
          await job.done()
        }
        {
          const job = await queue.receive()
          expect(job.payload).toEqual(`message normal`)
          await job.done()
        }

        queue.close()
      })
    }

    if (["local", "sqs", "beanstalkd", "rabbitmq", "mix"].indexOf(testcase) > -1) {
      it(`test ${testcase} count`, async () => {
        const queue = create(await getConfig(testcase))
        await queue.flush()

        for (let i = 0; i < 10; i++) {
          await queue.send(`message ${i}`)
        }

        expect(await queue.countWaiting()).toBe(10)

        for (let i = 0; i < 4; i++) {
          await queue.receive()
        }

        expect(await queue.countWaiting()).toBe(6)
        try {
          expect(await queue.countRunning()).toBe(4)
        } catch (e) {
          if (e.message !== "unsupport count running jobs") {
            throw e
          }
        }

        queue.close()
      })
    }
  })
})

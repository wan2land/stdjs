import { createQueue, Priority } from '../lib'
import { getConfig, timeout } from './utils'

const testcases = ['local', 'beanstalkd', 'rabbitmq']
if (process.env.AWS_ACCESS_KEY_ID
  && process.env.AWS_SECRET_ACCESS_KEY
  && process.env.AWS_SQS_URL
  && process.env.AWS_SQS_REGION) {
  testcases.push('sqs')
}

describe('queue', () => {
  testcases.forEach(testcase => {
    it(`test ${testcase} basic functions`, async () => {
      const queue = createQueue(await getConfig(testcase))
      await queue.flush()

      const messages = []

      for (let i = 0; i < 10; i++) {
        await queue.send(`message ${i}`)
        messages.push(`message ${i}`)
      }

      for (let i = 0; i < 10; i++) {
        const job = await queue.receive()
        if (!job) {
          throw new Error(`job(${i}) is undefined`)
        }
        const foundMessageKey = messages.indexOf(job.payload as string)
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

    if (['local'].includes(testcase)) {
      it(`test ${testcase} timeout`, async () => {
        const queue = createQueue(await getConfig(testcase))
        ;(queue as any).timeout = 100
        await queue.flush()

        for (let i = 0; i < 10; i++) {
          await queue.send(`message ${i}`)
        }
        for (let i = 0; i < 10; i++) {
          const job = await queue.receive()
          if (!job) {
            throw new Error(`job(${i}) is undefined`)
          }
          if (i % 2 === 1) {
            await job.done()
          }
        }

        await timeout(500)

        for (let i = 0; i < 5; i++) {
          const job = await queue.receive()
          if (!job) {
            throw new Error(`job(${i}) is undefined`)
          }
          expect(job.payload).toEqual(`message ${i * 2}`)
          await job.done()
        }

        queue.close()
      })
    }

    if (['beanstalkd', 'rabbitmq'].includes(testcase)) {
      it(`test ${testcase} priority`, async () => {
        const producer = createQueue(await getConfig(testcase))
        const consumer = createQueue(await getConfig(testcase))
        await producer.flush()

        await producer.send('message normal', { priority: Priority.Normal })
        await producer.send('message high', { priority: Priority.High })
        await producer.send('message highest', { priority: Priority.Highest })
        producer.close()

        {
          const job = await consumer.receive()
          if (!job) {
            throw new Error('job is undefined')
          }
          expect(job.payload).toEqual('message highest')
          await job.done()
        }
        {
          const job = await consumer.receive()
          if (!job) {
            throw new Error('job is undefined')
          }
          expect(job.payload).toEqual('message high')
          await job.done()
        }
        {
          const job = await consumer.receive()
          if (!job) {
            throw new Error('job is undefined')
          }
          expect(job.payload).toEqual('message normal')
          await job.done()
        }

        consumer.close()
      })
    }

    if (['local', 'sqs', 'beanstalkd', 'rabbitmq'].includes(testcase)) {
      it(`test ${testcase} count`, async () => {
        const queue = createQueue(await getConfig(testcase))
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
          if (e.message !== 'unsupport count running jobs') {
            throw e
          }
        }

        queue.close()
      })
    }
  })
})

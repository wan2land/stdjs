import { SQS } from 'aws-sdk'

import { Queue, SendQueueOptions } from '../../interfaces/queue'
import { SqsJob } from './job'


export class SqsQueue<TPayload> implements Queue<TPayload> {

  public constructor(public client: SQS, public url: string) {
  }

  public async close(): Promise<void> {
    //
  }

  public async countWaiting(): Promise<number> {
    const result = await this.client.getQueueAttributes({
      QueueUrl: this.url,
      AttributeNames: [
        'ApproximateNumberOfMessages',
      ],
    }).promise()
    if (result.Attributes && result.Attributes.ApproximateNumberOfMessages) {
      return parseInt(result.Attributes.ApproximateNumberOfMessages, 10)
    }
    throw new Error('cannot count waiting jobs')
  }

  public async countRunning(): Promise<number> {
    const result = await this.client.getQueueAttributes({
      QueueUrl: this.url,
      AttributeNames: [
        'ApproximateNumberOfMessagesNotVisible',
      ],
    }).promise()
    if (result.Attributes && result.Attributes.ApproximateNumberOfMessagesNotVisible) {
      return parseInt(result.Attributes.ApproximateNumberOfMessagesNotVisible, 10)
    }
    throw new Error('cannot count running jobs')
  }

  public async flush(): Promise<void> {
    await this.client.purgeQueue({
      QueueUrl: this.url,
    }).promise()
  }

  public async send(payload: TPayload, options?: SendQueueOptions): Promise<void> {
    await this.client.sendMessage({
      QueueUrl: this.url,
      MessageBody: JSON.stringify(payload),
      DelaySeconds: options && options.delay ? Math.max(Math.floor(options.delay / 1000), 900) : void 0,
    }).promise()
  }

  public async receive(): Promise<SqsJob<TPayload> | undefined> {
    const result = await this.client.receiveMessage({
      QueueUrl: this.url,
      MaxNumberOfMessages: 1,
    }).promise()
    const messages = result.Messages || []
    if (messages.length === 0) {
      return
    }
    const message = messages[0]

    return new SqsJob(this.url, message.ReceiptHandle as string, this, JSON.parse(message.Body as string))
  }

  public delete(job: SqsJob<TPayload>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.deleteMessage({
        QueueUrl: job.url,
        ReceiptHandle: job.id,
      }, (err) => {
        if (err) {
          reject(err)
          return
        }
        job.isDeleted = true
        resolve()
      })
    })
  }
}

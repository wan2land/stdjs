
// import { SQS } from "aws-sdk"
import { Queue, SendQueueOptions } from '../../interfaces/queue'
import { RawAwsSqs as SQS } from './interfaces'
import { SqsJob } from './job'
import { getQueueAttributes, purgeQueue, receiveMessages, sendMessage } from './promise'

export class SqsQueue<TPayload> implements Queue<TPayload> {

  public constructor(public client: SQS, public url: string) {
  }

  public async close(): Promise<void> {
    //
  }

  public async countWaiting(): Promise<number> {
    const attrs = await getQueueAttributes(this.client, {
      QueueUrl: this.url,
      AttributeNames: [
        'ApproximateNumberOfMessages',
      ],
    })
    if (attrs.Attributes && attrs.Attributes.ApproximateNumberOfMessages) {
      return parseInt(attrs.Attributes.ApproximateNumberOfMessages, 10)
    }
    throw new Error('cannot count waiting jobs')
  }

  public async countRunning(): Promise<number> {
    const attrs = await getQueueAttributes(this.client, {
      QueueUrl: this.url,
      AttributeNames: [
        'ApproximateNumberOfMessagesNotVisible',
      ],
    })
    if (attrs.Attributes && attrs.Attributes.ApproximateNumberOfMessagesNotVisible) {
      return parseInt(attrs.Attributes.ApproximateNumberOfMessagesNotVisible, 10)
    }
    throw new Error('cannot count running jobs')
  }

  public async flush(): Promise<void> {
    await purgeQueue(this.client, {
      QueueUrl: this.url,
    })
  }

  public async send(payload: TPayload, options?: SendQueueOptions): Promise<void> {
    await sendMessage(this.client, {
      QueueUrl: this.url,
      MessageBody: JSON.stringify(payload),
      DelaySeconds: options && options.delay ? Math.max(Math.floor(options.delay / 1000), 900) : void 0,
    })
  }

  public async receive(): Promise<SqsJob<TPayload> | undefined> {
    const messages = await receiveMessages(this.client, {
      QueueUrl: this.url,
      MaxNumberOfMessages: 1,
    })
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

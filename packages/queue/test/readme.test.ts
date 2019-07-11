import {
  AmqpQueue,
  AmqpQueueConfig,
  BeanstalkdQueue,
  BeanstalkdQueueConfig,
  create,
  LocalQueue,
  MixQueue,
  Priority,
  SqsQueue,
  SqsQueueConfig,
} from '../lib'
import { getConfig } from './helper'


describe("readmd", () => {
  it("test create local", async () => {
    const options = {}
    // section:create-local
    const connection = create({
      adapter: "local",

      // https://github.com/corgidisco/stdjs-queue/blob/master/src/driver/local/interfaces.ts
      ...options,
    })
    // endsection
    expect(connection instanceof LocalQueue).toBeTruthy()

    connection.close()
  })

  it("test create sqs", async () => {
    const options = {}
    const url = ((await getConfig("sqs")) as SqsQueueConfig).url

    // section:create-sqs
    const connection = create({
      adapter: "aws-sdk",

      // SQS URL
      url, // like "https://sqs.{region}.amazonaws.com/012345678910/your-sqs-name"

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property
      ...options,
    })
    // endsection
    expect(connection instanceof SqsQueue).toBeTruthy()

    connection.close()
  })

  it("test create rabbitmq", async () => {
    const config = (await getConfig("rabbitmq")) as AmqpQueueConfig
    const queue = config.queue
    const options = {
      port: config.port,
    }

    // section:create-rabbitmq
    const connection = create({
      adapter: "amqplib",

      // AMQP Queue Name
      queue, // like "amqp-queue-name",

      // http://www.squaremobius.net/amqp.node/channel_api.html#connecting-with-an-object-instead-of-a-url
      ...options,
    })
    // endsection
    expect(connection instanceof AmqpQueue).toBeTruthy()

    connection.close()
  })

  it("test create beanstalkd", async () => {
    const config = (await getConfig("beanstalkd")) as BeanstalkdQueueConfig
    const host = config.host
    const port = config.port
    const tube = config.tube

    // section:create-beanstalkd
    const connection = create({
      adapter: "beanstalkd",

      // beanstalkd connection
      host, // default "localhost"
      port, // default 11300

      // tube name
      tube,
    })
    // endsection
    expect(connection instanceof BeanstalkdQueue).toBeTruthy()

    connection.close()
  })

  it("test create mix", async () => {
    // section:create-mix
    const connection = create({
      adapter: "mix",
      queues: [
        {
          priority: Priority.Highest, // Priority Highest is 50

          // The following options are the same as the Queue create options.
          adapter: "local",
          timeout: 100,
        },
        {
          priority: Priority.High, // Priority High is 30
          adapter: "local",
          timeout: 100,
        },
        {
          priority: Priority.Normal, // Priority Normal is 10
          adapter: "local",
          timeout: 100,
        },
      ],
    })
    // endsection
    expect(connection instanceof MixQueue).toBeTruthy()

    connection.close()
  })
})

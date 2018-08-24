
import { AmqpQueueConfig } from "../driver/amqp/interfaces"
import { BeanstalkdQueueConfig } from "../driver/beanstalkd/interfaces"
import { LocalQueueConfig } from "../driver/local/interfaces"
import { SqsQueueConfig } from "../driver/sqs/interfaces"

export type QueueConfig = LocalQueueConfig
  | SqsQueueConfig
  | BeanstalkdQueueConfig
  | AmqpQueueConfig

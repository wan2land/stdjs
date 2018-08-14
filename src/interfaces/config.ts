
import { LocalQueueConfig } from "../driver/local/interfaces"
import { SqsQueueConfig } from "../driver/sqs/interfaces"

export type QueueConfig = LocalQueueConfig
  | SqsQueueConfig

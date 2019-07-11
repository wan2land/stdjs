
import { QueueConfig } from '../../interfaces/config'

export interface MixQueueConfig {
  readonly adapter: 'mix'
  queues: ({priority: number} & QueueConfig)[]
}

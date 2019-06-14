
export interface BeanstalkdQueueConfig {
  readonly adapter: "beanstalkd"
  host?: string
  port?: number
  tube?: string
}

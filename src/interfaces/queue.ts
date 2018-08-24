
export interface Queue<P> {
  close(): Promise<void>
  flush(): Promise<void>
  send(payload: P, options?: SendQueueOptions): Promise<void>
  receive(): Promise<Job<P> | undefined>
  delete(job: Job<P>): Promise<void>
}

export interface SendQueueOptions {
  delay?: number
  priority?: number
}

export interface Job<P> {
  payload: P
  queue: Queue<P>
  isDeleted: boolean
  done(): Promise<void>
}

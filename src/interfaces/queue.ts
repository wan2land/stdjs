
export interface Queue<P> {
  flush(): Promise<boolean>
  close(): Promise<void>
  send(payload: P, options?: SendQueueOptions): Promise<boolean>
  receive(): Promise<Job<P> | undefined>
  delete(job: Job<P>): Promise<boolean>
}

export interface SendQueueOptions {
  delay?: number
  priority?: number
}

export interface Job<P> {
  payload: P
  queue: Queue<P>
  isDeleted: boolean
  delete(): Promise<boolean>
}

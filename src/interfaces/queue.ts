
// section:interface
export enum Priority {
  Normal = 10,
  High = 30,
  Highest = 50,
}

export interface Queue<P> {
  close(): Promise<void>
  countWaiting(): Promise<number>
  countRunning(): Promise<number>
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
// endsection

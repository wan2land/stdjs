
// section:interface
export enum Priority {
  Normal = 10,
  High = 30,
  Highest = 50,
}

export interface Queue<TPayload> {
  close(): Promise<void>
  countWaiting(): Promise<number>
  countRunning(): Promise<number>
  flush(): Promise<void>
  send(payload: TPayload, options?: SendQueueOptions): Promise<void>
  receive(): Promise<Job<TPayload> | undefined>
  delete(job: Job<TPayload>): Promise<void>
}

export interface SendQueueOptions {
  delay?: number
  priority?: number
}

export interface Job<TPayload> {
  payload: TPayload
  queue: Queue<TPayload>
  isDeleted: boolean
  done(): Promise<void>
}
// endsection

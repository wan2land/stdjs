
export interface Connector {
  connect(): Cache
}

export interface Cache {
  close(): Promise<boolean>
  get<T>(key: string, defaultValue?: T): Promise<T | undefined>
  set<T>(key: string, value: T, ttl?: number): Promise<boolean> // ttl unit is `seconds`
  has(key: string): Promise<boolean>
  delete(key: string): Promise<boolean>
  clear(): Promise<boolean>
}

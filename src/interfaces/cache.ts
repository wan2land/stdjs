
// section:interface
export interface Cache {
  close(): Promise<boolean>
  get<P>(key: string, defaultValue?: P): Promise<P | undefined>
  set<P>(key: string, value: P, ttl?: number): Promise<boolean>
  has(key: string): Promise<boolean>
  delete(key: string): Promise<boolean>
  clear(): Promise<boolean>
}
// endsection

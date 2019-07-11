
// section:interface
export interface Cache {
  close(): Promise<boolean>
  get<TVal>(key: string, defaultValue?: TVal): Promise<TVal | undefined>
  set<TVal>(key: string, value: TVal, ttl?: number): Promise<boolean> // ttl unit is `seconds`
  has(key: string): Promise<boolean>
  delete(key: string): Promise<boolean>
  clear(): Promise<boolean>
}
// endsection


export interface Connection {
  close(): Promise<void>
  query(query: string, values?: any): Promise<any>
  select(query: string, values?: any): Promise<Row[]>
  first(query: string, values?: any): Promise<Row>
  transaction(handler: () => Promise<any>): Promise<void>
}

export interface Row {
  [key: string]: any
}

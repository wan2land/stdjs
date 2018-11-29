
export type TransactionHandler<P> = (connection: Connection) => Promise<P>|P

export interface Pool extends Connection {
  getConnection(): Promise<PoolConnection>
}

export interface PoolConnection extends Connection {
  release(): Promise<void>
}

export interface Connection {
  close(): Promise<void>
  query(query: string, values?: any): Promise<any>
  select<P extends Row>(query: string, values?: any): Promise<P[]>
  first<P>(query: string, values?: any): Promise<P|undefined>
  transaction<P>(handler: TransactionHandler<P>): Promise<P>
}

export interface Row {
  [key: string]: any
}

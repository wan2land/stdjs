
export type TransactionHandler<TResult> = (connection: Connection) => Promise<TResult> | TResult

export interface Connector {
  dialect: string
  connect(): Connection
}

export interface Pool extends Connection {
  getConnection(): Promise<PoolConnection>
}

export interface PoolConnection extends Connection {
  release(): Promise<void>
}

export interface Connection {
  close(): Promise<void>
  query(query: string, values?: any[]): Promise<QueryResult>
  first<TRow>(query: string, values?: any[]): Promise<TRow>
  select<TRow extends Row>(query: string, values?: any[]): Promise<TRow[]>
  transaction<TResult>(handler: TransactionHandler<TResult>): Promise<TResult>
}

export interface QueryResult {
  insertId?: number|string // insert query only
  changes: number
  raw: any
}

export interface Row {
  [key: string]: any
}

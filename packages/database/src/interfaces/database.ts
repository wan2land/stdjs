
// section:interfaces

export type Scalar = number | string | boolean | null

export type TransactionHandler<P> = (connection: Connection) => Promise<P>|P

export interface Pool extends Connection {
  getConnection(): Promise<PoolConnection>
}

export interface PoolConnection extends Connection {
  release(): Promise<void>
}

export interface Connection {
  close(): Promise<void>

  query(qb: QueryBuilder): Promise<QueryResult>
  query(query: string, values?: Scalar[]): Promise<QueryResult>

  select<P extends Row>(qb: QueryBuilder): Promise<P[]>
  select<P extends Row>(query: string, values?: Scalar[]): Promise<P[]>

  first<P>(qb: QueryBuilder): Promise<P|undefined>
  first<P>(query: string, values?: Scalar[]): Promise<P|undefined>

  firstOrThrow<P>(qb: QueryBuilder): Promise<P>
  firstOrThrow<P>(query: string, values?: Scalar[]): Promise<P>

  transaction<P>(handler: TransactionHandler<P>): Promise<P>
}

export interface QueryResult {
  insertId?: number|string // insert query only
  changes: number
  raw: any
}

export interface Row {
  [key: string]: any
}

export interface QueryBuilder {
  toSql(): string
  getBindings(): any[]
}

// endsection

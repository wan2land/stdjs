
// section:interfaces

export type Scalar = number | string | boolean | null

export type TransactionHandler<TRet> = (connection: Connection) => Promise<TRet>|TRet

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

  select<TRow extends Row>(qb: QueryBuilder): Promise<TRow[]>
  select<TRow extends Row>(query: string, values?: Scalar[]): Promise<TRow[]>

  first<TRow>(qb: QueryBuilder): Promise<TRow|undefined>
  first<TRow>(query: string, values?: Scalar[]): Promise<TRow|undefined>

  firstOrThrow<TRow>(qb: QueryBuilder): Promise<TRow>
  firstOrThrow<TRow>(query: string, values?: Scalar[]): Promise<TRow>

  transaction<TRet>(handler: TransactionHandler<TRet>): Promise<TRet>
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

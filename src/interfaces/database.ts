
// section:interfaces

export type TransactionHandler<P> = (connection: Connection) => Promise<P>|P

export interface Pool extends Connection {
  getConnection(): Promise<PoolConnection>
}

export interface PoolConnection extends Connection {
  release(): Promise<void>
}

export interface Connection {
  close(): Promise<void>
  query(qb: QueryBuilder): Promise<any>
  query(query: string, values?: any): Promise<any>
  select<P extends Row>(qb: QueryBuilder): Promise<P[]>
  select<P extends Row>(query: string, values?: any): Promise<P[]>
  first<P>(qb: QueryBuilder): Promise<P|undefined>
  first<P>(query: string, values?: any): Promise<P|undefined>
  transaction<P>(handler: TransactionHandler<P>): Promise<P>
}

export interface Row {
  [key: string]: any
}

export interface QueryBuilder {
  toSql(): string
  getBindings(): any[]
}

// endsection

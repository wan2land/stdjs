
// only for developing
// import "pg"

export interface PgConnectionConfig {
  readonly type: "sqlite3"
  filename: string
  mode?: number
}

export interface PgRawPool {
    connect(): Promise<PgRawPoolClient>
    end(): Promise<void>
    query(queryTextOrConfig: string, values?: any[]): Promise<PgRawQueryResult>
}

export interface PgRawClient extends PgRawClientBase {
  end(): Promise<void>
}

export interface PgRawPoolClient extends PgRawClientBase {
  release(err?: Error): void
}

export interface PgRawClientBase {
  connect(): Promise<void>
  query(queryTextOrConfig: string, values?: any[]): Promise<PgRawQueryResult>
}

export interface PgRawQueryResult {
  command: string
  rowCount: number
  oid: number
  fields: PgRawFieldDef[]
  rows: any[]
}

export interface PgRawFieldDef {
  name: string
  tableID: number
  columnID: number
  dataTypeID: number
  dataTypeSize: number
  dataTypeModifier: number
  format: string
}

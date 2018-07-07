
// only for developing
// import "pg"

import * as stream from "stream"
import * as tls from "tls"

export interface PgConnectionConfig {
  readonly type: "pg"
}

// @ref @types/pg PoolConfig
export interface PgPoolConfig extends PgConnectionConfigBase {
  readonly type: "pg-pool"

  max?: number
  min?: number
  connectionTimeoutMillis?: number
  idleTimeoutMillis?: number

  application_name?: string
  Promise?: PromiseConstructorLike
}

// @ref @types/pg ClientConfig, ConnectionConfig
export interface PgConnectionConfigBase {
  ssl?: boolean | tls.TlsOptions

  user?: string
  database?: string
  password?: string
  port?: number
  host?: string
  connectionString?: string
  keepAlive?: boolean
  stream?: stream.Duplex
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

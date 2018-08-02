
// only for developing
// import "pg"

import * as stream from "stream"
import * as tls from "tls"

// @ref @types/pg PoolConfig, ClientConfig, ConnectionConfig

// section:config
interface PgConnectionConfig extends PgBaseConfig {
  readonly adapter: "pg"
  readonly pool?: false
}

interface PgPoolConfig extends PgBaseConfig {
  readonly adapter: "pg"
  readonly pool: true

  max?: number
  min?: number
  connectionTimeoutMillis?: number
  idleTimeoutMillis?: number

  application_name?: string
  Promise?: PromiseConstructorLike
}

interface PgBaseConfig {
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
// endsection

export {
  PgConnectionConfig,
  PgPoolConfig,
  PgBaseConfig,
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

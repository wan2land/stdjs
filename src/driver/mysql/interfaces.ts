
// only for developing
// import "mysql"

// @ref @types/mysql ConnectionOptions + ConnectionConfig

// section:config
interface MysqlConnectionConfig extends MysqlBaseConfig {
  readonly adapter: "mysql" | "mysql2"
}

interface MysqlPoolConfig extends MysqlBaseConfig {
  readonly adapter: "mysql-pool" | "mysql2-pool"
  acquireTimeout?: number
  waitForConnections?: boolean
  connectionLimit?: number
  queueLimit?: number
}

interface MysqlBaseConfig {
  host?: string
  port?: number
  user?: string
  password?: string
  database?: string
  charset?: string
  timeout?: number
  localAddress?: string
  socketPath?: string
  timezone?: string
  connectTimeout?: number
  stringifyObjects?: boolean
  insecureAuth?: boolean
  supportBigNumbers?: boolean
  bigNumberStrings?: boolean
  dateStrings?: boolean
  trace?: boolean
  multipleStatements?: boolean
  flags?: string[]
  queryFormat?(query: string, values: any): void
}
// endsection

export {
  MysqlConnectionConfig,
  MysqlPoolConfig,
  MysqlBaseConfig,
}

export interface MysqlRawQuery {
  sql: string
  values?: string[]
}

export type MysqlRawQueryCb = (err: Error|undefined, results?: any) => void

export interface MysqlRawConnection {
  query(options: string, values: any, callback?: MysqlRawQueryCb): MysqlRawQuery
  end(callback?: (err: Error|undefined, ...args: any[]) => void): void
  beginTransaction(callback: (err: Error|undefined) => void): void
  commit(callback: (err: Error|undefined) => void): void
  rollback(callback: (err: Error|undefined) => void): void
}

export interface MysqlRawPool {
  query(options: string, values: any, callback?: MysqlRawQueryCb): MysqlRawQuery
  end(callback?: (err: Error|undefined, ...args: any[]) => void): void
  getConnection(callback: (err: Error|undefined, connection: MysqlRawConnection) => void): void
}

export interface MysqlRawResult {
  fieldCount: number
  affectedRows: number
  insertId: number
  serverStatus: number
  warningCount: number
  message: string
  changedRows: number
  // protocol41: boolean // ?
}

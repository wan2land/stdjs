
import { MysqlRawConnection, MysqlRawPool } from "../mysql/interfaces"

export interface Mysql2RawQuery {
  sql: string
  values?: string[]
}

export type Mysql2RawQueryCb = (err: Error|undefined, results?: any) => void

export interface Mysql2RawConnection extends MysqlRawConnection {
  execute(options: string, values: any, callback?: Mysql2RawQueryCb): Mysql2RawQuery
  query(options: string, values: any, callback?: Mysql2RawQueryCb): Mysql2RawQuery
}

export interface Mysql2RawPool extends MysqlRawPool {
  execute(options: string, values: any, callback?: Mysql2RawQueryCb): Mysql2RawQuery
  query(options: string, values: any, callback?: Mysql2RawQueryCb): Mysql2RawQuery
  getConnection(callback: (err: Error|undefined, connection: Mysql2RawConnection) => void): void
}

export interface Mysql2RawResult {
  fieldCount: number
  affectedRows: number
  insertId: number
  info: string
  serverStatus: number
  warningCount: number
}


// only for developing
// import {} from "mysql"

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


export interface Mysql2RawQuery {
  sql: string
  values?: string[]
}

export type Mysql2RawQueryCb = (err: Error|undefined, results?: Mysql2RawResult) => void

export interface Mysql2RawConnection {
  execute(options: string, values: any, callback?: Mysql2RawQueryCb): any
  end(callback?: (err: Error|undefined, ...args: any[]) => void): void
  beginTransaction(callback: (err: Error|undefined) => void): void
  commit(callback: (err: Error|undefined) => void): void
  rollback(callback: (err: Error|undefined) => void): void
}

export interface Mysql2RawPoolConnection extends Mysql2RawConnection {
  release(): void
}

export interface Mysql2RawPool {
  execute(options: string, values: any, callback?: Mysql2RawQueryCb): any
  end(callback?: (err: Error|undefined, ...args: any[]) => void): void
  getConnection(callback: (err: Error|undefined, connection: Mysql2RawPoolConnection) => void): void
}

export interface Mysql2RawResult {
  fieldCount: number
  affectedRows: number
  insertId: number
  info: string
  serverStatus: number
  warningCount: number
}

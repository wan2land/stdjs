
// only for developing
// import "sqlite3"

// section:config
interface Sqlite3ConnectionConfig {
  readonly adapter: "sqlite3"
  filename: string
  mode?: number
}
// endsection

export {
  Sqlite3ConnectionConfig,
}
export interface Sqlite3RawConnection {
  close(callback?: (err: Error | null) => void): void
  run(sql: string, params: any, callback?: (this: Sqlite3RawResult, err: Error | null) => void): this
  get(sql: string, params: any, callback?: (this: Sqlite3RawStatement, err: Error | null, row: any) => void): this
  all(sql: string, params: any, callback?: (this: Sqlite3RawStatement, err: Error | null, rows: any[]) => void): this
}

export interface Sqlite3RawStatement {
  sql?: string
}

export interface Sqlite3RawResult extends Sqlite3RawStatement {
  lastID: number
  changes: number
}

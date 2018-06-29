
export interface MysqlResult {
  fieldCount: number
  affectedRows: number
  insertId: number
  serverStatus: number
  warningCount: number
  message: string
  changedRows: number
  // protocol41: boolean // ?
}

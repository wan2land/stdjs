
import { Row } from "../../interfaces/database"
import { MysqlConnection } from "../mysql/connection"
import { Mysql2RawConnection } from "./interfaces"

export class Mysql2Connection extends MysqlConnection {

  constructor(protected connection: Mysql2RawConnection) {
    super(connection)
  }

  public select(query: string, values?: any): Promise<Row[]> {
    if (Array.isArray(values)) {
      values = values.map(value => typeof value  === "undefined" ? null : value)
    }
    return new Promise((resolve, reject) => {
      this.connection.execute(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve((rows && rows.map) ? rows.map((result: any) => ({...result})) : [])
      })
    })
  }

  public query(query: string, values?: any): Promise<any> {
    if (Array.isArray(values)) {
      values = values.map(value => typeof value  === "undefined" ? null : value)
    }
    return new Promise((resolve, reject) => {
      this.connection.execute(query, values, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }
}


import { Connection, Row } from "../../interfaces/database"
import { MysqlPool } from "../mysql/pool"
import { Mysql2Connection } from "./connection"
import { Mysql2RawPool } from "./interfaces"

export class Mysql2Pool extends MysqlPool {

  constructor(protected pool: Mysql2RawPool) {
    super(pool)
  }

  public select(query: string, values?: any): Promise<Row[]> {
    if (Array.isArray(values)) {
      values = values.map(value => typeof value  === "undefined" ? null : value)
    }
    return new Promise((resolve, reject) => {
      this.pool.execute(query, values, (err, rows: any) => {
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
      this.pool.execute(query, values, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  public getConnection(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          return reject(err)
        }
        resolve(new Mysql2Connection(conn))
      })
    })
  }
}

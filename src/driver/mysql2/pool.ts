
import { Connection, Row } from "../../interfaces/database"
import { MysqlRawConnection } from "../mysql/interfaces"
import { MysqlPool } from "../mysql/pool"
import { Mysql2Connection } from "./connection"
import { Mysql2RawPool } from "./interfaces"

export class Mysql2Pool extends MysqlPool {

  constructor(protected pool: Mysql2RawPool) {
    super(pool)
  }

  public query(query: string, values?: any): Promise<MysqlRawConnection|Row[]> {
    return new Promise((resolve, reject) => {
      this.pool.execute(query, values, (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  public async transaction<P>(handler: (connection: Connection) => Promise<any>): Promise<any> {
    const connection = await this.getConnection()
    return connection.transaction(handler)
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

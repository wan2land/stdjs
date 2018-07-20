
import { Connection, Pool, Row } from "../../interfaces/database"
import { MysqlConnection } from "./connection"
import { MysqlRawConnection, MysqlRawPool } from "./interfaces"

export class MysqlPool implements Pool {

  constructor(protected pool: MysqlRawPool) {
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public async first(query: string, values?: any): Promise<Row> {
    const items = await this.select(query, values)
    return items[0]
  }

  public async select(query: string, values?: any): Promise<Row[]> {
    const items = await this.query(query, values) as Row[]
    return items ? items.map((item: any) => ({...item})) : []
  }

  public query(query: string, values?: any): Promise<MysqlRawConnection|Row[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (err, results) => {
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
        resolve(new MysqlConnection(conn))
      })
    })
  }
}

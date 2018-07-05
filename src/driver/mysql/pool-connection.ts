
import {Connection, Row} from "../../interfaces/interfaces"
import {MysqlRawConnection, MysqlRawPool} from "./interfaces"
import {transaction} from "./utils"
import {MysqlConnection} from "./connection"

export class MysqlPoolConnection implements Connection {

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
    const rawConn = await new Promise<MysqlRawConnection>((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          return reject(err)
        }
        resolve(conn)
      })
    })
    await transaction(rawConn, new MysqlConnection(rawConn), handler)
  }
}

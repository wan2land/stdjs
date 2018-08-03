
import { Connection, Row, TransactionHandler } from "../../interfaces/database"
import { MysqlRawConnection } from "./interfaces"
import { beginTransaction, commit, rollback } from "./utils"

export class MysqlConnection implements Connection {

  constructor(protected connection: MysqlRawConnection) {
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.end((err: any) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public async first(query: string, values?: any): Promise<Row|undefined> {
    const items = await this.select(query, values)
    return items[0]
  }

  public select(query: string, values?: any): Promise<Row[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve((rows && rows.map) ? rows.map((result: any) => ({...result})) : [])
      })
    })
  }

  public query(query: string, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  public async transaction<P>(handler: TransactionHandler<P>): Promise<P> {
    await beginTransaction(this.connection)
    try {
      const ret = await handler(this)
      await commit(this.connection)
      return ret
    } catch (e) {
      await rollback(this.connection)
      throw e
    }
  }
}

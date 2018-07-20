
import {
  Connection,
  Row,
  TransactionHandler,
} from "../../interfaces/database"
import {
  MysqlRawConnection,
  MysqlRawResult,
} from "./interfaces"
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

  public async first(query: string, values?: any): Promise<Row> {
    const items = await this.select(query, values)
    return items[0]
  }

  public async select(query: string, values?: any): Promise<Row[]> {
    const items = await this.query(query, values) as Row[]
    return items ? items.map((item: any) => ({...item})) : []
  }

  public query(query: string, values?: any): Promise<MysqlRawResult|Row[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err: any, results: MysqlRawResult|Row[]) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
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

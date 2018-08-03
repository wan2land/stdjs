
import { Row, TransactionHandler } from "../../interfaces/database"
import { MysqlConnection } from "../mysql/connection"
import { MysqlRawResult } from "../mysql/interfaces"
import { beginTransaction, commit, rollback } from "../mysql/utils"
import { Mysql2RawConnection } from "./interfaces"

export class Mysql2Connection extends MysqlConnection {

  constructor(protected connection: Mysql2RawConnection) {
    super(connection)
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

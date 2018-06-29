
import {Pool} from "mysql"
import {Connection as ConnectionInterface, Row} from "../interfaces/interfaces"
import {MysqlResult} from "../interfaces/mysql"

export class MysqlPoolConnection implements ConnectionInterface {

  constructor(protected pool: Pool) {
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

  public query(query: string, values?: any): Promise<MysqlResult|Row[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }
}

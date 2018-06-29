
import {Connection} from "mysql"
import {Connection as ConnectionInterface, Row} from "../../interfaces/interfaces"
import {MysqlResult} from "../../interfaces/mysql"
import {transaction} from "./utils"

export class MysqlConnection implements ConnectionInterface {

  constructor(protected connection: Connection) {
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
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
      this.connection.query(query, values, (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }

  public transaction(handler: () => Promise<any>): Promise<void> {
    return transaction(this.connection, handler)
  }
}

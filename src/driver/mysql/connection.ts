import { Connection, Row, TransactionHandler } from "../../interfaces/database"
import { MysqlRawConnection } from "./interfaces"


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

  public async first<P extends Row>(query: string, values?: any): Promise<P|undefined> {
    const items = await this.select<P>(query, values)
    return items[0]
  }

  public select<P extends Row>(query: string, values?: any): Promise<P[]> {
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
    await new Promise((resolve, reject) => {
      this.connection.beginTransaction((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
    try {
      const ret = await handler(this)
      await new Promise((resolve, reject) => {
        this.connection.commit((err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
      return ret
    } catch (e) {
      await new Promise((resolve, reject) => {
        this.connection.rollback((err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
      throw e
    }
  }
}

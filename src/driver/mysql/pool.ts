import {
  Connection,
  Pool,
  PoolConnection,
  Row
  } from "../../interfaces/database"
import { MysqlRawPool } from "./interfaces"
import { MysqlPoolConnection } from "./pool-connection"


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

  public async first(query: string, values?: any): Promise<Row|undefined> {
    const items = await this.select(query, values)
    return items[0]
  }

  public select(query: string, values?: any): Promise<Row[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve((rows && rows.map) ? rows.map((result: any) => ({...result})) : [])
      })
    })
  }

  public query(query: string, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  public async transaction<P>(handler: (connection: Connection) => Promise<any>): Promise<any> {
    const connection = await this.getConnection()
    try {
      const result = connection.transaction(handler)
      await connection.release()
      return result
    } catch (e) {
      await connection.release()
      throw e
    }
  }

  public getConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          return reject(err)
        }
        resolve(new MysqlPoolConnection(conn))
      })
    })
  }
}

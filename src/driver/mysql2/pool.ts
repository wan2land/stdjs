import {
  Connection,
  Pool,
  PoolConnection,
  QueryBuilder,
  Row
  } from "../../interfaces/database"
import { isQueryBuilder } from "../../utils"
import { Mysql2RawPool } from "./interfaces"
import { Mysql2PoolConnection } from "./pool-connection"


export class Mysql2Pool implements Pool {

  constructor(protected pool: Mysql2RawPool) {
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

  public async first<P extends Row>(queryOrQb: string|QueryBuilder, values?: any): Promise<P|undefined> {
    return (await this.select<P>(queryOrQb, values))[0]
  }

  public select<P extends Row>(queryOrQb: string|QueryBuilder, values?: any): Promise<P[]> {
    let query: string
    if (isQueryBuilder(queryOrQb)) {
      query = queryOrQb.toSql()
      values = queryOrQb.getBindings() || []
    } else {
      query = queryOrQb
    }
    if (Array.isArray(values)) {
      values = values.map(value => typeof value  === "undefined" ? null : value)
    }
    return new Promise((resolve, reject) => {
      this.pool.execute(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve((rows && rows.map) ? rows.map((result: any) => ({...result})) : [])
      })
    })
  }

  public query(queryOrQb: string|QueryBuilder, values?: any): Promise<any> {
    let query: string
    if (isQueryBuilder(queryOrQb)) {
      query = queryOrQb.toSql()
      values = queryOrQb.getBindings() || []
    } else {
      query = queryOrQb
    }
    if (Array.isArray(values)) {
      values = values.map(value => typeof value  === "undefined" ? null : value)
    }
    return new Promise((resolve, reject) => {
      this.pool.execute(query, values, (err, result) => {
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
        resolve(new Mysql2PoolConnection(conn))
      })
    })
  }
}

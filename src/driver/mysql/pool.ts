import { RowNotFoundError } from "../../error/row-not-found-error"
import {
  Connection,
  Pool,
  PoolConnection,
  QueryBuilder,
  QueryResult,
  Row,
  Scalar
  } from "../../interfaces/database"
import { isQueryBuilder } from "../../utils"
import { MysqlRawPool } from "./interfaces"
import { MysqlPoolConnection } from "./pool-connection"


export class MysqlPool implements Pool {

  constructor(public pool: MysqlRawPool) {
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

  public async first<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P|undefined> {
    return (await this.select<P>(queryOrQb, values))[0]
  }

  public async firstOrThrow<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P|undefined> {
    const rows = await this.select<P>(queryOrQb, values)
    if (rows.length) {
      return rows[0]
    }
    throw new RowNotFoundError()
  }

  public select<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P[]> {
    return new Promise((resolve, reject) => {
      let query: string
      if (isQueryBuilder(queryOrQb)) {
        query = queryOrQb.toSql()
        values = queryOrQb.getBindings() || []
      } else {
        query = queryOrQb
      }
      this.pool.query(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve((rows && rows.map) ? rows.map((result: any) => ({...result})) : [])
      })
    })
  }

  public query(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      let query: string
      if (isQueryBuilder(queryOrQb)) {
        query = queryOrQb.toSql()
        values = queryOrQb.getBindings() || []
      } else {
        query = queryOrQb
      }
      this.pool.query(query, values, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve({
          insertId: result!.insertId || undefined,
          changes: result!.affectedRows,
          raw: result,
        })
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

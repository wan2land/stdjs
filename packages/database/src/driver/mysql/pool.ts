import { RowNotFoundError } from '../../error/row-not-found-error'
import { Connection, Pool, PoolConnection, QueryBuilder, QueryResult, Row, Scalar } from '../../interfaces/database'
import { isQueryBuilder } from '../../utils'
import { MysqlRawPool } from './interfaces'
import { MysqlPoolConnection } from './pool-connection'


export class MysqlPool implements Pool {

  public constructor(public pool: MysqlRawPool) {
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

  public async first<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow|undefined> {
    return (await this.select<TRow>(queryOrQb, values))[0]
  }

  public async firstOrThrow<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow|undefined> {
    const rows = await this.select<TRow>(queryOrQb, values)
    if (rows.length > 0) {
      return rows[0]
    }
    throw new RowNotFoundError()
  }

  public select<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow[]> {
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
        resolve(rows && rows.map ? rows.map((result: any) => ({ ...result })) : [])
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

  public async transaction<TRet>(handler: (connection: Connection) => Promise<any>): Promise<TRet> {
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

import { RowNotFoundError } from '../../error/row-not-found-error'
import { Connection, QueryBuilder, QueryResult, Row, Scalar, TransactionHandler } from '../../interfaces/database'
import { isQueryBuilder } from '../../utils'
import { Mysql2RawConnection } from './interfaces'


export class Mysql2Connection implements Connection {

  public constructor(public connection: Mysql2RawConnection) {
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
    if (Array.isArray(values)) {
      values = values.map(value => typeof value === 'undefined' ? null : value)
    }
    return new Promise((resolve, reject) => {
      let query: string
      if (isQueryBuilder(queryOrQb)) {
        query = queryOrQb.toSql()
        values = queryOrQb.getBindings() || []
      } else {
        query = queryOrQb
      }
      this.connection.execute(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve(rows && rows.map ? rows.map((result: any) => ({ ...result })) : [])
      })
    })
  }

  public query(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<QueryResult> {
    if (Array.isArray(values)) {
      values = values.map(value => typeof value === 'undefined' ? null : value)
    }
    return new Promise((resolve, reject) => {
      let query: string
      if (isQueryBuilder(queryOrQb)) {
        query = queryOrQb.toSql()
        values = queryOrQb.getBindings() || []
      } else {
        query = queryOrQb
      }
      this.connection.execute(query, values, (err, result) => {
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

  public async transaction<TRet>(handler: TransactionHandler<TRet>): Promise<TRet> {
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

import { RowNotFoundError } from '../../error/row-not-found-error'
import { Connection, QueryBuilder, QueryResult, Row, Scalar, TransactionHandler } from '../../interfaces/database'
import { isQueryBuilder } from '../../utils'
import { Sqlite3RawConnection } from './interfaces'


export class Sqlite3Connection implements Connection {

  public constructor(public connection: Sqlite3RawConnection) {
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.close((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public first<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow|undefined> {
    return new Promise<TRow|undefined>((resolve, reject) => {
      let query: string
      if (isQueryBuilder(queryOrQb)) {
        query = queryOrQb.toSql()
        values = queryOrQb.getBindings() || []
      } else {
        query = queryOrQb
      }
      this.connection.get(query, values || [], (err, row) => {
        if (err) {
          return reject(err)
        }
        resolve(row)
      })
    })
  }

  public firstOrThrow<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow|undefined> {
    return new Promise<TRow|undefined>((resolve, reject) => {
      let query: string
      if (isQueryBuilder(queryOrQb)) {
        query = queryOrQb.toSql()
        values = queryOrQb.getBindings() || []
      } else {
        query = queryOrQb
      }
      this.connection.get(query, values || [], (err, row) => {
        if (err) {
          return reject(err)
        }
        if (!row) {
          return reject(new RowNotFoundError())
        }
        resolve(row)
      })
    })
  }

  public select<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow[]> {
    return new Promise<TRow[]>((resolve, reject) => {
      let query: string
      if (isQueryBuilder(queryOrQb)) {
        query = queryOrQb.toSql()
        values = queryOrQb.getBindings() || []
      } else {
        query = queryOrQb
      }
      this.connection.all(query, values || [], (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
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
      this.connection.run(query, values || [], function (err: Error|null): void {
        if (err) {
          return reject(err)
        }
        resolve({
          insertId: /^insert/i.test(query) ? this.lastID : undefined, // eslint-disable-line no-invalid-this
          changes: this.changes, // eslint-disable-line no-invalid-this
          raw: this, // eslint-disable-line no-invalid-this
        })
      })
    })
  }

  public async transaction<TRet>(handler: TransactionHandler<TRet>): Promise<TRet> {
    await this.query('BEGIN TRANSACTION')
    try {
      const result = await handler(this)
      await this.query('COMMIT')
      return result
    } catch (e) {
      await this.query('ROLLBACK')
      throw e
    }
  }
}

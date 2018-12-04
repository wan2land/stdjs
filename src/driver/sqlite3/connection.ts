import {
  Connection,
  QueryBuilder,
  Row,
  TransactionHandler
  } from "../../interfaces/database"
import { isQueryBuilder } from "../../utils"
import { Sqlite3RawConnection } from "./interfaces"


export class Sqlite3Connection implements Connection {

  constructor(protected connection: Sqlite3RawConnection) {
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.close(((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      }))
    })
  }

  public first<P extends Row>(queryOrQb: string|QueryBuilder, values?: any): Promise<P|undefined> {
    return new Promise<P|undefined>((resolve, reject) => {
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

  public select<P extends Row>(queryOrQb: string|QueryBuilder, values?: any): Promise<P[]> {
    return new Promise<P[]>((resolve, reject) => {
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

  public query(queryOrQb: string|QueryBuilder, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let query: string
      if (isQueryBuilder(queryOrQb)) {
        query = queryOrQb.toSql()
        values = queryOrQb.getBindings() || []
      } else {
        query = queryOrQb
      }
      // tslint:disable:only-arrow-functions
      this.connection.run(query, values || [], function(err: Error|null): void {
        if (err) {
          return reject(err)
        }
        resolve(this)
      })
      // tslint:enable:only-arrow-functions
    })
  }

  public async transaction<P>(handler: TransactionHandler<P>): Promise<P> {
    await this.query("BEGIN TRANSACTION")
    try {
      const result = await handler(this)
      await this.query("COMMIT")
      return result
    } catch (e) {
      await this.query("ROLLBACK")
      throw e
    }
  }
}

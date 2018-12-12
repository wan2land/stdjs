import {
  Connection,
  QueryBuilder,
  QueryResult,
  Row,
  Scalar,
  TransactionHandler
  } from "../../interfaces/database"
import { isQueryBuilder } from "../../utils"
import { MysqlRawConnection } from "./interfaces"


export class MysqlConnection implements Connection {

  constructor(public connection: MysqlRawConnection) {
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

  public async first<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P|undefined> {
    return (await this.select<P>(queryOrQb, values))[0]
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
      this.connection.query(query, values, (err, rows: any) => {
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
      this.connection.query(query, values, (err, result) => {
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

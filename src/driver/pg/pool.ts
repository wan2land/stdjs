import {
  Pool,
  PoolConnection,
  QueryBuilder,
  QueryResult,
  Row,
  Scalar,
  TransactionHandler
  } from "../../interfaces/database"
import { isQueryBuilder } from "../../utils"
import { PgRawPool } from "./interfaces"
import { PgPoolConnection } from "./pool-connection"


export class PgPool implements Pool {

  constructor(protected pool: PgRawPool) {
  }

  public async close(): Promise<void> {
    await this.pool.end()
  }

  public async first<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P|undefined> {
    return (await this.select<P>(queryOrQb, values))[0]
  }

  public async select<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P[]> {
    if (isQueryBuilder(queryOrQb)) {
      return (await this.pool.query(queryOrQb.toSql(), queryOrQb.getBindings() || [])).rows
    } else {
      return (await this.pool.query(queryOrQb, values || [])).rows
    }
  }

  public async query(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<QueryResult> {
    const result = isQueryBuilder(queryOrQb)
      ? await this.pool.query(queryOrQb.toSql(), queryOrQb.getBindings() || [])
      : await this.pool.query(queryOrQb, values || [])
    let insertId: any
    if (result.rows.length) {
      const firstRow = result.rows[0]
      insertId = Object.values(firstRow)[0]
    }
    return {
      insertId,
      changes: result.rowCount,
      raw: result,
    }
  }

  public async transaction<P>(handler: TransactionHandler<P>): Promise<P> {
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

  public async getConnection(): Promise<PoolConnection> {
    return new PgPoolConnection(await this.pool.connect())
  }
}

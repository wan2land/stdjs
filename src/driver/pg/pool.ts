import {
  Pool,
  PoolConnection,
  QueryBuilder,
  Row,
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

  public async first<P extends Row>(queryOrQb: string|QueryBuilder, values?: any): Promise<P|undefined> {
    return (await this.select<P>(queryOrQb, values))[0]
  }

  public async select<P extends Row>(queryOrQb: string|QueryBuilder, values?: any): Promise<P[]> {
    return (await this.query(queryOrQb, values)).rows
  }

  public async query(queryOrQb: string|QueryBuilder, values?: any): Promise<any> {
    if (isQueryBuilder(queryOrQb)) {
      return await this.pool.query(queryOrQb.toSql(), queryOrQb.getBindings() || [])
    } else {
      return await this.pool.query(queryOrQb, values || [])
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

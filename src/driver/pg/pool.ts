import {
  Pool,
  PoolConnection,
  Row,
  TransactionHandler
  } from "../../interfaces/database"
import { PgRawPool } from "./interfaces"
import { PgPoolConnection } from "./pool-connection"


export class PgPool implements Pool {

  constructor(protected pool: PgRawPool) {
  }

  public async close(): Promise<void> {
    await this.pool.end()
  }

  public async first(query: string, values?: any): Promise<Row|undefined> {
    const rows = await this.select(query, values)
    return rows[0]
  }

  public async select(query: string, values?: any): Promise<Row[]> {
    const res = await this.pool.query(query, values || [])
    return res.rows
  }

  public async query(query: string, values?: any): Promise<any> {
    return await this.pool.query(query, values || [])
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

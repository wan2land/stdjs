
import {
  Connection,
  Row,
  TransactionHandler,
  Pool,
} from "../../interfaces/interfaces"
import {
  PgRawQueryResult,
  PgRawPool,
} from "./interfaces"
import { PgConnection } from "./connection"

export class PgPool implements Pool {

  constructor(protected pool: PgRawPool) {
  }

  public async close(): Promise<void> {
    await this.pool.end()
  }

  public async first(query: string, values?: any): Promise<Row> {
    const rows = await this.select(query, values)
    return rows[0]
  }

  public async select(query: string, values?: any): Promise<Row[]> {
    const res = await this.query(query, values || [])
    return res.rows
  }

  public async query(query: string, values?: any): Promise<PgRawQueryResult> {
    return await this.pool.query(query, values || [])
  }

  public async transaction<P>(handler: TransactionHandler<P>): Promise<P> {
    const connection = await this.getConnection()
    await connection.query("BEGIN")
    try {
      const result = await handler(connection)
      await connection.query("COMMIT")
      await connection.close()
      return result
    } catch (e) {
      await connection.query("ROLLBACK")
      await connection.close()
      throw e
    }
  }

  public async getConnection(): Promise<Connection> {
    return new PgConnection(await this.pool.connect())
  }
}


import {
  Connection,
  Row,
  TransactionHandler,
} from "../../interfaces/interfaces"
import {
  PgRawQueryResult,
  PgRawClient,
} from "./interfaces"

export class PgConnection implements Connection {

  constructor(protected client: PgRawClient) {
  }

  public async close(): Promise<void> {
    if ((this.client as any)._connected) {
      await this.client.end()
    }
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
    await this.connect()
    return await this.client.query(query, values || [])
  }

  public async transaction<P>(handler: TransactionHandler<P>): Promise<P> {
    await this.query("BEGIN")
    try {
      const result = await handler(this)
      await this.query("COMMIT")
      return result
    } catch (e) {
      await this.query("ROLLBACK")
      throw e
    }
  }

  protected async connect(): Promise<void> {
    if (!(this.client as any)._connected) {
      await this.client.connect()
    }
  }
}

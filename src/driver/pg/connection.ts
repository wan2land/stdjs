import { Connection, Row, TransactionHandler } from "../../interfaces/database"
import { PgRawClient, PgRawClientBase, PgRawPoolClient } from "./interfaces"


export class PgConnection implements Connection {

  constructor(protected client: PgRawClientBase) {
  }

  public async close(): Promise<void> {
    if ((this.client as any)._connected) {
      if ((this.client as PgRawPoolClient).release) {
        await (this.client as PgRawPoolClient).release()
      } else if ((this.client as PgRawClient).end) {
        await (this.client as PgRawClient).end()
      }
    }
  }

  public async first<P extends Row>(query: string, values?: any): Promise<P|undefined> {
    const items = await this.select<P>(query, values)
    return items[0]
  }

  public async select<P extends Row>(query: string, values?: any): Promise<P[]> {
    await this.connect()
    const res = await this.client.query(query, values || [])
    return res.rows
  }

  public async query(query: string, values?: any): Promise<any> {
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

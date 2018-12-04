import {
  Connection,
  QueryBuilder,
  Row,
  TransactionHandler
  } from "../../interfaces/database"
import { isQueryBuilder } from "../../utils"
import { PgRawClient, PgRawClientBase, PgRawPoolClient } from "./interfaces"


export class PgConnection implements Connection {

  constructor(public client: PgRawClientBase) {
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

  public async first<P extends Row>(queryOrQb: string|QueryBuilder, values?: any): Promise<P|undefined> {
    return (await this.select<P>(queryOrQb, values))[0]
  }

  public async select<P extends Row>(queryOrQb: string|QueryBuilder, values?: any): Promise<P[]> {
    return (await this.query(queryOrQb, values)).rows
  }

  public async query(queryOrQb: string|QueryBuilder, values?: any): Promise<any> {
    await this.connect()
    if (isQueryBuilder(queryOrQb)) {
      return await this.client.query(queryOrQb.toSql(), queryOrQb.getBindings() || [])
    } else {
      return await this.client.query(queryOrQb, values || [])
    }
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

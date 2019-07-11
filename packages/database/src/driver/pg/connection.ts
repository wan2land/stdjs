import { RowNotFoundError } from '../../error/row-not-found-error'
import { Connection, QueryBuilder, QueryResult, Row, Scalar, TransactionHandler } from '../../interfaces/database'
import { isQueryBuilder } from '../../utils'
import { PgRawClient, PgRawClientBase, PgRawPoolClient } from './interfaces'


export class PgConnection implements Connection {

  public constructor(public client: PgRawClientBase) {
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

  public async first<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow|undefined> {
    return (await this.select<TRow>(queryOrQb, values))[0]
  }

  public async firstOrThrow<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow|undefined> {
    const rows = await this.select<TRow>(queryOrQb, values)
    if (rows.length > 0) {
      return rows[0]
    }
    throw new RowNotFoundError()
  }

  public async select<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<TRow[]> {
    await this.connect()
    const result = isQueryBuilder(queryOrQb)
      ? await this.client.query(queryOrQb.toSql(), queryOrQb.getBindings() || [])
      : await this.client.query(queryOrQb, values || [])
    return result.rows
  }

  public async query(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<QueryResult> {
    await this.connect()
    const result = isQueryBuilder(queryOrQb)
      ? await this.client.query(queryOrQb.toSql(), queryOrQb.getBindings() || [])
      : await this.client.query(queryOrQb, values || [])
    let insertId: any
    if (result.rows.length > 0) {
      const firstRow = result.rows[0]
      const keys = Object.keys(firstRow)
      insertId = firstRow[keys[0]]
    }
    return {
      insertId,
      changes: result.rowCount,
      raw: result,
    }
  }

  public async transaction<TRow>(handler: TransactionHandler<TRow>): Promise<TRow> {
    await this.query('BEGIN')
    try {
      const result = await handler(this)
      await this.query('COMMIT')
      return result
    } catch (e) {
      await this.query('ROLLBACK')
      throw e
    }
  }

  protected async connect(): Promise<void> {
    if (!(this.client as any)._connected) {
      await this.client.connect()
    }
  }
}

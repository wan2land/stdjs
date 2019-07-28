import { ClientBase } from 'pg'

import { RowNotFoundError } from '../../errors/row-not-found-error'
import { QueryResult, Row } from '../../interfaces/database'

export class PgBaseConnection {

  public constructor(public client: ClientBase) {
  }

  public async first<TRow extends Row>(query: string, values: any[] = []): Promise<TRow> {
    const rows = await this.select<TRow>(query, values)
    if (rows.length > 0) {
      return rows[0]
    }
    throw new RowNotFoundError()
  }

  public async select<TRow extends Row>(query: string, values: any[] = []): Promise<TRow[]> {
    await this.connect()
    const result = await this.client.query(query, values || [])
    return result.rows
  }

  public async query(query: string, values: any[] = []): Promise<QueryResult> {
    await this.connect()
    const result = await this.client.query(query, values || [])
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

  public async connect(): Promise<void> {
    if (!(this.client as any)._connected) {
      await this.client.connect()
    }
  }
}

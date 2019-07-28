import { Client } from 'pg'

import { Connection, TransactionHandler } from '../../interfaces/database'
import { PgBaseConnection } from './base-connection'

export class PgConnection extends PgBaseConnection implements Connection {

  public constructor(public client: Client) {
    super(client)
  }

  public async close() {
    if ((this.client as any)._connected) {
      await this.client.end()
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
}

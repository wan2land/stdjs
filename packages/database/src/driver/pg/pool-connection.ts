import { PoolClient } from 'pg'

import { PoolConnection, TransactionHandler } from '../../interfaces/database'
import { PgBaseConnection } from './base-connection'


export class PgPoolConnection extends PgBaseConnection implements PoolConnection {

  public constructor(public client: PoolClient) {
    super(client)
  }


  public async close() {
    if ((this.client as any)._connected) {
      await this.client.release()
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

  public async release() {
    await this.client.release()
  }
}

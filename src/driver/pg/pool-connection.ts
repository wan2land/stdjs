import { PoolConnection } from "../../interfaces/database"
import { PgConnection } from "./connection"
import { PgRawPoolClient } from "./interfaces"


export class PgPoolConnection extends PgConnection implements PoolConnection {

  constructor(public connection: PgRawPoolClient) {
    super(connection)
  }

  public async release(): Promise<void> {
    this.connection.release()
  }
}

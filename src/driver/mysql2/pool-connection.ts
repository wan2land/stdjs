import { PoolConnection } from "../../interfaces/database"
import { Mysql2Connection } from "./connection"
import { Mysql2RawPoolConnection } from "./interfaces"


export class Mysql2PoolConnection extends Mysql2Connection implements PoolConnection {

  constructor(protected connection: Mysql2RawPoolConnection) {
    super(connection)
  }

  public async release(): Promise<void> {
    this.connection.release()
  }
}

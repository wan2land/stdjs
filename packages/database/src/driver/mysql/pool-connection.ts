import { PoolConnection } from "../../interfaces/database"
import { MysqlConnection } from "./connection"
import { MysqlRawPoolConnection } from "./interfaces"


export class MysqlPoolConnection extends MysqlConnection implements PoolConnection {

  public constructor(public connection: MysqlRawPoolConnection) {
    super(connection)
  }

  public async release(): Promise<void> {
    this.connection.release()
  }
}

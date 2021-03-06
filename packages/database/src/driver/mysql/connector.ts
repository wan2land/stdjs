import { createConnection, createPool } from 'mysql'

import { Connector, Connection } from '../../interfaces/database'
import { MysqlConnection } from './connection'
import { MysqlConnectorOptions, MysqlPoolConnectorOptions } from './interfaces'
import { MysqlPool } from './pool'


export class MysqlConnector implements Connector {

  public dialect = 'mysql'

  public constructor(public options: MysqlConnectorOptions | MysqlPoolConnectorOptions) {
  }

  public connect(): Connection {
    const { pool, ...options } = this.options
    if (pool) {
      return new MysqlPool(createPool(options))
    }
    return new MysqlConnection(createConnection(options))
  }
}

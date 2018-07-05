
import {create} from "./create"

import {MysqlConnection} from "./driver/mysql/connection"
import {MysqlPoolConnection} from "./driver/mysql/pool-connection"

export * from "./interfaces/config"
export * from "./interfaces/interfaces"

export * from "./driver/mysql/interfaces"

export {
  create,

  MysqlConnection,
  MysqlPoolConnection,
}

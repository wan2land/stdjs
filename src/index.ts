
export * from "./interfaces/config"
export * from "./interfaces/interfaces"
export * from "./interfaces/mysql"

import {create} from "./create"

import {MysqlConnection} from "./driver/mysql/connection"
import {MysqlPoolConnection} from "./driver/mysql/pool-connection"

export {
  create,

  MysqlConnection,
  MysqlPoolConnection,
}

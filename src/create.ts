
import {ConnectionConfig, MysqlConnectionConfig, MysqlPoolConnectionConfig} from "./interfaces/config"
import {Connection} from "./interfaces/interfaces"
import {MysqlConnection} from "./connection/mysql"
import {MysqlPoolConnection} from "./connection/mysql-pool"

export function create(config: MysqlConnectionConfig): MysqlConnection
export function create(config: MysqlPoolConnectionConfig): MysqlPoolConnection
export function create(originConfig: ConnectionConfig): Connection {
  const {type, ...config} = originConfig
  if (type === "mysql" || type === "mysql2") {
    const modulename = type === "mysql2" ? "mysql2" : "mysql"
    return new MysqlConnection(require(modulename).createConnection(config))
  } else if (type === "mysql-pool" || type === "mysql2-pool") {
    const modulename = type === "mysql2-pool" ? "mysql2" : "mysql"
    return new MysqlPoolConnection(require(modulename).createPool(config))
  }
  throw new Error(`cannot resolve type named "${type}"`)
}

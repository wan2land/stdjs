
import {ConnectionConfig, MysqlConnectionConfig, MysqlPoolConnectionConfig} from "./interfaces/config"
import {Connection} from "./interfaces/interfaces"
import {MysqlConnection} from "./connection/mysql"
import {MysqlPoolConnection} from "./connection/mysql-pool"

export function create(config: MysqlConnectionConfig): MysqlConnection
export function create(config: MysqlPoolConnectionConfig): MysqlPoolConnection
export function create(config: ConnectionConfig): Connection {
  if (config.type === "mysql") {
    return new MysqlConnection(require("mysql").createConnection({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      charset: config.charset,
      timezone: config.timezone,
      connectTimeout: config.timeout,
    }))
  } else if (config.type === "mysql-pool") {
    return new MysqlPoolConnection(require("mysql").createPool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      charset: config.charset,
      timezone: config.timezone,
      connectTimeout: config.timeout,
      acquireTimeout: config.acquireTimeout,
      waitForConnections: config.waitForConnections,
      connectionLimit: config.connectionLimit,
      queueLimit: config.queueLimit,
    }))
  }
  throw new Error(`cannot resolve type named "${(config as any).type}"`)
}

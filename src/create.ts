
import {ConnectionConfig} from "./interfaces/config"
import {Connection} from "./interfaces/interfaces"
import {MysqlConnection} from "./driver/mysql/connection"
import {MysqlPoolConnection} from "./driver/mysql/pool-connection"

function getModuleName(type: string): string {
  switch (type) {
    case "mysql2":
    case "mysql2-pool":
      return "mysql2"
  }
  return "mysql"
}

export function create(originConfig: ConnectionConfig): Connection {
  const {type, ...config} = originConfig
  if (type === "mysql" || type === "mysql2") {
    return new MysqlConnection(
      require(getModuleName(type)).createConnection(config),
    )
  } else if (type === "mysql-pool" || type === "mysql2-pool") {
    return new MysqlPoolConnection(
      require(getModuleName(type)).createPool(config),
    )
  }
  throw new Error(`cannot resolve type named "${type}"`)
}

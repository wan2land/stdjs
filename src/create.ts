
import { ConnectionConfig } from "./interfaces/config"
import { Connection } from "./interfaces/interfaces"
import { MysqlConnection } from "./driver/mysql/connection"
import { MysqlPoolConnection } from "./driver/mysql/pool-connection"
import { Sqlite3Connection } from "./driver/sqlite3/connection"
import { PgConnection } from "./driver/pg/connection"
import { PgPool } from "./driver/pg/pool"

function getModuleName(type: string): string {
  switch (type) {
    case "mysql2":
    case "mysql2-pool":
      return "mysql2"
  }
  return "mysql"
}

export function create(config: ConnectionConfig): Connection {
  if (config.type === "mysql" || config.type === "mysql2") {
    const {type, ...remainConfig} = config
    return new MysqlConnection(
      require(getModuleName(config.type)).createConnection(remainConfig),
    )
  } else if (config.type === "mysql-pool" || config.type === "mysql2-pool") {
    const {type, ...remainConfig} = config
    return new MysqlPoolConnection(
      require(getModuleName(config.type)).createPool(remainConfig),
    )
  } else if (config.type === "sqlite3") {
    const sqlite3 = require("sqlite3")
    return new Sqlite3Connection(new sqlite3.Database(config.filename, config.mode))
  } else if (config.type === "pg") {
    const {type, ...remainConfig} = config
    const pg = require("pg")
    return new PgConnection(new pg.Client(remainConfig))
  } else if (config.type === "pg-pool") {
    const {type, ...remainConfig} = config
    const pg = require("pg")
    return new PgPool(new pg.Pool(remainConfig))
  }
  throw new Error(`cannot resolve type named "${config.type}"`)
}

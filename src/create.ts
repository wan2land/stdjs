
import { MysqlConnection } from "./driver/mysql/connection"
import { MysqlPool } from "./driver/mysql/pool"
import { PgConnection } from "./driver/pg/connection"
import { PgPool } from "./driver/pg/pool"
import { Sqlite3Connection } from "./driver/sqlite3/connection"
import { ConnectionConfig } from "./interfaces/config"
import { Connection } from "./interfaces/database"

function getModuleName(type: string): string {
  switch (type) {
    case "mysql2":
    case "mysql2-pool":
      return "mysql2"
  }
  return "mysql"
}

export function create(config: ConnectionConfig): Connection {
  if (config.adapter === "mysql" || config.adapter === "mysql2") {
    const {adapter, ...remainConfig} = config
    return new MysqlConnection(
      require(getModuleName(config.adapter)).createConnection(remainConfig)
    )
  } else if (config.adapter === "mysql-pool" || config.adapter === "mysql2-pool") {
    const {adapter, ...remainConfig} = config
    return new MysqlPool(
      require(getModuleName(config.adapter)).createPool(remainConfig)
    )
  } else if (config.adapter === "sqlite3") {
    const sqlite3 = require("sqlite3")
    return new Sqlite3Connection(new sqlite3.Database(config.filename, config.mode))
  } else if (config.adapter === "pg") {
    const {adapter, ...remainConfig} = config
    const pg = require("pg")
    return new PgConnection(new pg.Client(remainConfig))
  } else if (config.adapter === "pg-pool") {
    const {adapter, ...remainConfig} = config
    const pg = require("pg")
    return new PgPool(new pg.Pool(remainConfig))
  }
  throw new Error(`cannot resolve adapter named "${config.adapter}"`)
}

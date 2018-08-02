
import { MysqlConnection } from "./driver/mysql/connection"
import { MysqlPool } from "./driver/mysql/pool"
import { PgConnection } from "./driver/pg/connection"
import { PgPool } from "./driver/pg/pool"
import { Sqlite3Connection } from "./driver/sqlite3/connection"
import { ConnectionConfig } from "./interfaces/config"
import { Connection } from "./interfaces/database"

function isArrayOfConfig(config: any): config is ConnectionConfig[] {
  return Array.isArray(config)
}

function isMapOfConfig(config: any): config is {[name: string]: ConnectionConfig} {
  const keys = Object.keys(config)
  if (keys.length === 0) {
    return true
  }
  return !config.adapter && config[keys[0]].adapter
}

export function create(configs: ConnectionConfig[]): Connection[]
export function create(configs: {[name: string]: ConnectionConfig}): {[name: string]: Connection}
export function create(config: ConnectionConfig): Connection
export function create(config: any): any {
  if (isArrayOfConfig(config)) {
    return config.map(conf => create(conf))
  }
  if (isMapOfConfig(config)) {
    const connections: {[name: string]: Connection} = {}
    Object.keys(config).map((key) => {
      connections[key] = create(config[key])
    })
    return connections
  }

  const {adapter, pool, ...remainConfig} = config
  if (config.adapter === "mysql" || config.adapter === "mysql2") {
    return config.pool
      ? new MysqlPool(require(config.adapter).createPool(remainConfig))
      : new MysqlConnection(require(config.adapter).createConnection(remainConfig))
  } else if (config.adapter === "pg") {
    const pg = require("pg")
    return config.pool
      ? new PgPool(new pg.Pool(remainConfig))
      : new PgConnection(new pg.Client(remainConfig))
  } else if (config.adapter === "sqlite3") {
    const sqlite3 = require("sqlite3")
    return new Sqlite3Connection(new sqlite3.Database(config.filename, config.mode))
  }
  throw new Error(`cannot resolve adapter named "${config.adapter}"`)
}

/* eslint-disable import/no-unresolved, @typescript-eslint/no-require-imports */

import { ConnectionConfig } from './interfaces/config'
import { Connection } from './interfaces/database'

// drivers
import { ClusterConnection } from './driver/cluster/connection'
import { MysqlConnection } from './driver/mysql/connection'
import { MysqlPool } from './driver/mysql/pool'
import { Mysql2Connection } from './driver/mysql2/connection'
import { Mysql2Pool } from './driver/mysql2/pool'
import { PgConnection } from './driver/pg/connection'
import { PgPool } from './driver/pg/pool'
import { Sqlite3Connection } from './driver/sqlite3/connection'

export function create(config: ConnectionConfig): Connection {
  const { adapter, pool, ...remainConfig } = config
  if (config.adapter === 'cluster') {
    return new ClusterConnection(create(config.read), create(config.write))
  } if (config.adapter === 'mysql') {
    const lib = require('mysql')
    return config.pool
      ? new MysqlPool(lib.createPool(remainConfig))
      : new MysqlConnection(lib.createConnection(remainConfig))
  } if (config.adapter === 'mysql2') {
    const lib = require('mysql2')
    return config.pool
      ? new Mysql2Pool(lib.createPool(remainConfig))
      : new Mysql2Connection(lib.createConnection(remainConfig))
  } if (config.adapter === 'pg') {
    const pg = require('pg')
    return config.pool
      ? new PgPool(new pg.Pool(remainConfig))
      : new PgConnection(new pg.Client(remainConfig))
  } if (config.adapter === 'sqlite3') {
    const sqlite3 = require('sqlite3')
    return new Sqlite3Connection(new sqlite3.Database(config.filename, config.mode))
  }
  throw new Error(`cannot resolve adapter named "${config.adapter}"`)
}

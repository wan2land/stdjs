
import {
  MysqlConnectionConfig,
  MysqlPoolConfig,
} from "../driver/mysql/interfaces"
import { PgConnectionConfig, PgPoolConfig } from "../driver/pg/interfaces"
import { Sqlite3ConnectionConfig } from "../driver/sqlite3/interfaces"

export type ConnectionConfig = MysqlConnectionConfig
  | MysqlPoolConfig
  | Sqlite3ConnectionConfig
  | PgConnectionConfig
  | PgPoolConfig

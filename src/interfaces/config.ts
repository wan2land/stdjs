
import {
  MysqlConnectionConfig,
  MysqlPoolConfig,
} from "../driver/mysql/interfaces"
import { Sqlite3ConnectionConfig } from "../driver/sqlite3/interfaces"
import { PgConnectionConfig, PgPoolConfig } from "../driver/pg/interfaces"

export type ConnectionConfig = MysqlConnectionConfig
  | MysqlPoolConfig
  | Sqlite3ConnectionConfig
  | PgConnectionConfig
  | PgPoolConfig

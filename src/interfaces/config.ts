
import {
  MysqlConnectionConfig,
  MysqlPoolConnectionConfig,
} from "../driver/mysql/interfaces"
import { Sqlite3ConnectionConfig } from "../driver/sqlite3/interfaces"

export type ConnectionConfig = MysqlConnectionConfig
  | MysqlPoolConnectionConfig
  | Sqlite3ConnectionConfig

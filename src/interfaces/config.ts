
import { MysqlConnectionConfig, MysqlPoolConfig } from "../driver/mysql/interfaces"
import { PgConnectionConfig, PgPoolConfig } from "../driver/pg/interfaces"
import { Sqlite3ConnectionConfig } from "../driver/sqlite3/interfaces"

export type ConnectionConfig = SingleConnectionConfig | ClusterConnectionConfig

export interface ClusterConnectionConfig {
  adapter: "cluster"
  readonly pool?: false
  read: SingleConnectionConfig
  write: SingleConnectionConfig
}

export type SingleConnectionConfig = MysqlConnectionConfig
  | MysqlPoolConfig
  | Sqlite3ConnectionConfig
  | PgConnectionConfig
  | PgPoolConfig

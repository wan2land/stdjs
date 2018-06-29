
import {ConnectionConfig, PoolConfig} from "mysql"

export type ConnectionConfig = MysqlConnectionConfig | MysqlPoolConnectionConfig

export interface MysqlConnectionConfig extends ConnectionConfig {
  readonly type: "mysql" | "mysql2"
}

export interface MysqlPoolConnectionConfig extends PoolConfig {
  readonly type: "mysql-pool" | "mysql2-pool"
}

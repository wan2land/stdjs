
import {
  MysqlConnectionConfig,
  MysqlPoolConnectionConfig,
} from "../driver/mysql/interfaces"

export type ConnectionConfig = MysqlConnectionConfig | MysqlPoolConnectionConfig

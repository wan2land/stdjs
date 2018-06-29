
export type ConnectionConfig = MysqlConnectionConfig | MysqlPoolConnectionConfig

export interface BaseConnectionConfig {
  readonly type: "mysql" | "mysql-pool"
  readonly host?: string
  readonly port?: number
  readonly database?: string
  readonly user?: string
  readonly password?: string
  readonly charset?: string
  readonly timezone?: string
  readonly timeout?: number
}

export interface MysqlConnectionConfig extends BaseConnectionConfig {
  readonly type: "mysql"
}

export interface MysqlPoolConnectionConfig extends BaseConnectionConfig {
  readonly type: "mysql-pool"
  readonly acquireTimeout?: number
  readonly waitForConnections?: boolean
  readonly connectionLimit?: number
  readonly queueLimit?: number
}

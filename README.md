# Async DB Adapter

[![Downloads](https://img.shields.io/npm/dt/async-db-adapter.svg)](https://npmcharts.com/compare/async-db-adapter?minimal=true)
[![Version](https://img.shields.io/npm/v/async-db-adapter.svg)](https://www.npmjs.com/package/async-db-adapter)
[![License](https://img.shields.io/npm/l/async-db-adapter.svg)](https://www.npmjs.com/package/async-db-adapter)

[![NPM](https://nodei.co/npm/async-db-adapter.png)](https://www.npmjs.com/package/async-db-adapter)

Async database adapter for Javascript(& Typescript).

## Installation

```bash
npm install async-db-adapter --save
```

## Usage

You can create as follows:

(Please refer to the Config section for config.)

```javascript
const connection = require("async-db-adapter").create({
  adapter: "mysql"
  /* config */
})
// or import {create} from "async-db-adapter"
// create(/* ... */)
```

### Support Current Database Connection

Use `adapter` parameter of `create` function`s config

- mysql (require `npm install mysql --save`)
- mysql-pool (require `npm install mysql --save`)
- mysql2 (require `npm install mysql2 --save`)
- mysql2-pool (require `npm install mysql2 --save`)
- pg (require `npm install pg --save`)
- pg-pool (require `npm install pg --save`)
- sqlite3 (require `npm install sqlite3 --save`)

### Methods

All adapter objects inherit the following interfaces:

```typescript
type TransactionHandler<P> = (connection: Connection) => Promise<P>|P

// mysql-pool, mysql2-pool, pg-pool
interface Pool extends Connection {
  getConnection(): Promise<Connection>
}

// mysql, mysql2, pg, sqlite3
interface Connection {
  close(): Promise<void>
  query(query: string, values?: any): Promise<any>
  select(query: string, values?: any): Promise<Row[]>
  first(query: string, values?: any): Promise<Row|undefined>
  transaction<P>(handler: TransactionHandler<P>): Promise<P>
}
```

### Config

Config can be defined as follows:

#### Mysql / Mysql2

Use the connection option of the `mysql` or `mysql2`.

```typescript
interface MysqlConnectionConfig extends MysqlBaseConfig {
  readonly adapter: "mysql" | "mysql2"
}

interface MysqlPoolConfig extends MysqlBaseConfig {
  readonly adapter: "mysql-pool" | "mysql2-pool"
  acquireTimeout?: number
  waitForConnections?: boolean
  connectionLimit?: number
  queueLimit?: number
}

interface MysqlBaseConfig {
  host?: string
  port?: number
  user?: string
  password?: string
  database?: string
  charset?: string
  timeout?: number
  localAddress?: string
  socketPath?: string
  timezone?: string
  connectTimeout?: number
  stringifyObjects?: boolean
  insecureAuth?: boolean
  supportBigNumbers?: boolean
  bigNumberStrings?: boolean
  dateStrings?: boolean
  trace?: boolean
  multipleStatements?: boolean
  flags?: string[]
  queryFormat?(query: string, values: any): void
}
```

#### Postgres

Use the connection option of the `pg`.

```typescript
interface PgConnectionConfig extends PgBaseConfig {
  readonly adapter: "pg"
}

interface PgPoolConfig extends PgBaseConfig {
  readonly adapter: "pg-pool"

  max?: number
  min?: number
  connectionTimeoutMillis?: number
  idleTimeoutMillis?: number

  application_name?: string
  Promise?: PromiseConstructorLike
}

interface PgBaseConfig {
  ssl?: boolean | tls.TlsOptions

  user?: string
  database?: string
  password?: string
  port?: number
  host?: string
  connectionString?: string
  keepAlive?: boolean
  stream?: stream.Duplex
}
```


#### Sqlite

Use the connection option of the `sqlite3`.

```typescript
interface Sqlite3ConnectionConfig {
  readonly adapter: "sqlite3"
  filename: string
  mode?: number
}
```

## License

MIT

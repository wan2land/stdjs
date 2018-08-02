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

### Support Database Connection

- mysql (require `npm install mysql --save`)
- mysql2 (require `npm install mysql2 --save`)
- pg (require `npm install pg --save`)
- sqlite3 (require `npm install sqlite3 --save`)

### Create Connection

Use `adapter`, `pool` parameter of `create` function`s config

#### mysql

```typescript
const connection = create({
  adapter: "mysql",
  ...mysqlConfig,
}) // return instanceof MysqlConnection
```

```typescript
const connection = create({
  adapter: "mysql",
  pool: true,
  ...mysqlConfig,
}) // return instanceof MysqlPool
```

#### mysql2

```typescript
const connection = create({
  adapter: "mysql2",
  ...mysqlConfig,
}) // return instanceof MysqlConnection
```

```typescript
const connection = create({
  adapter: "mysql2",
  pool: true,
  ...mysqlConfig,
}) // return instanceof MysqlPool
```

#### pg

```typescript
const connection = create({
  adapter: "pg",
  ...pgConfig,
}) // return instanceof PgConnection
```

```typescript
const connection = create({
  adapter: "pg",
  pool: true,
  ...pgConfig,
}) // return instanceof PgPool
```

#### sqlite3

```typescript
const connection = create({
  adapter: "sqlite3",
  filename: ":memory:",
}) // return instanceof Sqlite3Connection
```

#### Multiple Connection (Array)

```typescript
const connections = create([
  {
    adapter: "mysql2",
    pool: true,
    ...mysqlConfig,
  },
  {
    adapter: "pg",
    pool: true,
    ...pgConfig,
  },
  {
    adapter: "sqlite3",
    filename: ":memory:",
  },
]) // return instanceof [MysqlPool, PgPool, Sqlite3Connection]
```

#### Multiple Connection (Object)

```typescript
const connections = create({
  default: {
    adapter: "mysql2",
    pool: true,
    ...mysqlConfig,
  },
  pg: {
    adapter: "pg",
    pool: true,
    ...pgConfig,
  },
  sqlite: {
    adapter: "sqlite3",
    filename: ":memory:",
  },
}) // return instanceof {default: MysqlPool, pg: PgPool, sqlite: Sqlite3Connection}
```



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
  readonly pool?: false
}

interface MysqlPoolConfig extends MysqlBaseConfig {
  readonly adapter: "mysql" | "mysql2"
  readonly pool: true

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
  readonly pool?: false
}

interface PgPoolConfig extends PgBaseConfig {
  readonly adapter: "pg"
  readonly pool: true

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
  readonly pool?: false
  filename: string
  mode?: number
}
```

## License

MIT

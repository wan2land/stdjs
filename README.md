# STDJS - Database

[![Build](https://travis-ci.org/corgidisco/stdjs-database.svg?branch=master)](https://travis-ci.org/corgidisco/stdjs-database)
[![Downloads](https://img.shields.io/npm/dt/@stdjs/database.svg)](https://npmcharts.com/compare/@stdjs/database?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/database.svg)](https://www.npmjs.com/package/@stdjs/database)
[![License](https://img.shields.io/npm/l/@stdjs/database.svg)](https://www.npmjs.com/package/@stdjs/database)

[![dependencies Status](https://david-dm.org/corgidisco/stdjs-database/status.svg)](https://david-dm.org/corgidisco/stdjs-database)
[![devDependencies Status](https://david-dm.org/corgidisco/stdjs-database/dev-status.svg)](https://david-dm.org/corgidisco/stdjs-database?type=dev)

[![NPM](https://nodei.co/npm/@stdjs/database.png)](https://www.npmjs.com/package/@stdjs/database)

Database Adapter with Async/Promise for Javascript(& Typescript).

## Installation

```bash
npm install @stdjs/database --save
```

## Support Database Connection

- mysql (require `npm install mysql --save`)
- mysql2 (require `npm install mysql2 --save`)
- pg (require `npm install pg --save`)
- sqlite3 (require `npm install sqlite3 --save`)

## Interfaces

All adapter objects inherit the following interfaces:

```typescript

export type TransactionHandler<P> = (connection: Connection) => Promise<P>|P

export interface Pool extends Connection {
  getConnection(): Promise<PoolConnection>
}

export interface PoolConnection extends Connection {
  release(): Promise<void>
}

export interface Connection {
  close(): Promise<void>
  query(qb: QueryBuilder): Promise<any>
  query(query: string, values?: any): Promise<any>
  select<P extends Row>(qb: QueryBuilder): Promise<P[]>
  select<P extends Row>(query: string, values?: any): Promise<P[]>
  first<P>(qb: QueryBuilder): Promise<P|undefined>
  first<P>(query: string, values?: any): Promise<P|undefined>
  transaction<P>(handler: TransactionHandler<P>): Promise<P>
}

export interface Row {
  [key: string]: any
}

export interface QueryBuilder {
  toSql(): string
  getBindings(): any[]
}
```

## Usage

You can create as follows:

(Please refer to the Config section for config.)

```javascript
const database = require("@stdjs/database")
const connection = database.create({
  adapter: "mysql"
  /* config */
})

// or
import { create } from "@stdjs/database"
const connection = create({
  adapter: "mysql"
  /* config */
})
```

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
}) // return instanceof Mysql2Connection
```

```typescript
const connection = create({
  adapter: "mysql2",
  pool: true,
  ...mysqlConfig,
}) // return instanceof Mysql2Pool
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

#### Cluster Connection

If you are using the cluster as AWS Aurora DB, you can do the following:

```typescript
const connection = create({
  adapter: "cluster",
  write: {
    adapter: "mysql2",
    pool: true,
    host: "stdjs-database.cluster-abcdef1234.ap-somewhere.rds.amazonaws.com",
    ...mysqlConfig,
  },
  read: {
    adapter: "mysql2",
    pool: true,
    host: "stdjs-database.cluster-ro-abcdef1234.ap-somewhere.rds.amazonaws.com",
    ...mysqlConfig,
  },
}) // return instanceof ClusterConnection
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

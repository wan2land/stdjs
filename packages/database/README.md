# STDJS - Database

[![Downloads](https://img.shields.io/npm/dt/@stdjs/database.svg)](https://npmcharts.com/compare/@stdjs/database?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/database.svg)](https://www.npmjs.com/package/@stdjs/database)
[![License](https://img.shields.io/npm/l/@stdjs/database.svg)](https://www.npmjs.com/package/@stdjs/database)

[![NPM](https://nodei.co/npm/@stdjs/database.png)](https://www.npmjs.com/package/@stdjs/database)

Database Adapter with Async/Promise for Javascript(& Typescript).

## Installation

```bash
npm install @stdjs/database --save
```

## Support Database Connection

- mysql (require `npm install mysql --save`, `npm install @types/mysql -D`)
- mysql2 (require `npm install mysql2 --save`, `npm install types/mysql2 -D`)
- pg (require `npm install pg --save`, `npm install @types/pg -D`)
- sqlite3 (require `npm install sqlite3 --save`, `npm install @types/sqlite3 -D`)

## Interfaces

All adapter objects inherit the following interfaces:

```typescript

export type TransactionHandler<TResult> = (connection: Connection) => Promise<TResult> | TResult

export interface Connector {
  dialect: string
  connect(): Connection
}

export interface Pool extends Connection {
  getConnection(): Promise<PoolConnection>
}

export interface PoolConnection extends Connection {
  release(): Promise<void>
}

export interface Connection {
  close(): Promise<void>
  query(query: string, values?: any[]): Promise<QueryResult>
  first<TRow>(query: string, values?: any[]): Promise<TRow> // throw RowNotFoundError
  select<TRow extends Row>(query: string, values?: any[]): Promise<TRow[]>
  transaction<TResult>(handler: TransactionHandler<TResult>): Promise<TResult>
}

export interface QueryResult {
  insertId?: number|string // insert query only
  changes: number
  raw: any
}

export interface Row {
  [key: string]: any
}
```

## Usage

You can create as follows:

(Please refer to the Config section for config.)

```javascript
const database = require("@stdjs/database")
const connection = database.createConnection(/* Connector */)

// or
import { create } from "@stdjs/database"
const connection = createConnection(/* Connector */)
```


### Create Connection

#### mysql

**Options**

- [mysql: connection options](https://github.com/mysqljs/mysql#connection-options).
- [mysql: pool options](https://github.com/mysqljs/mysql#pool-options)

```typescript
import { createConnection } from "@stdjs/database" 
import { MysqlConnector } from '@stdjs/database/lib/driver/mysql'

const connection = createConnection(new MysqlConnector({
  /* mysql connection options */
}))

const pool = createConnection(new MysqlConnector({
  pool: true,
  /* mysql pool options */
}))
```

#### mysql2

**Options**

- [mysql2: API and Configuration](https://github.com/sidorares/node-mysql2#api-and-configuration)

```typescript
import { createConnection } from "@stdjs/database" 
import { Mysql2Connector } from '@stdjs/database/lib/driver/mysql2'

const connection = createConnection(new Mysql2Connector({
  /* mysql2 connection options */
}))

const pool = createConnection(new Mysql2Connector({
  pool: true,
  /* mysql2 pool options */
}))
```

#### pg

**Options**

- [pg: pg.Client](https://node-postgres.com/api/client)
- [pg: pg.Pool](https://node-postgres.com/api/pool)

```typescript
import { createConnection } from "@stdjs/database" 
import { PgConnector } from '@stdjs/database/lib/driver/pg'

const connection = createConnection(new PgConnector({
  /* pg connection options */
}))

const pool = createConnection(new PgConnector({
  pool: true,
  /* pg pool options */
}))
```

#### sqlite3

**Options**

```typescript
interface Sqlite3ConnectorOptions {
  filename: string
  mode?: number
}
```

```typescript
import { createConnection } from "@stdjs/database" 
import { Sqlite3Connector } from '@stdjs/database/lib/driver/sqlite3'

const connection = createConnection(new Sqlite3Connector({
  /* sqlite3 connection options (Sqlite3ConnectorOptions) */
}))
```

#### Cluster Connection

If you are using the cluster as AWS Aurora DB, you can do the following:

```typescript
import { createCluster } from "@stdjs/database" 
import { Mysql2Connector } from '@stdjs/database/lib/driver/mysql2'

const connection = createCluster({
  write: new Mysql2Connector({
    pool: true,
    host: "stdjs.com",
  }),
  read: new Mysql2Connector({
    pool: true,
    host: "readonly.stdjs.com",
  }),
})
```

The `select` and `first` methods use `read` connection and the `query` method uses `write` connection.

## License

MIT

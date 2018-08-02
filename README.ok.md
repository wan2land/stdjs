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

@code("./test/readme.test.ts@create-mysql-connection", "typescript")

@code("./test/readme.test.ts@create-mysql-pool", "typescript")

#### mysql2

@code("./test/readme.test.ts@create-mysql2-connection", "typescript")

@code("./test/readme.test.ts@create-mysql2-pool", "typescript")

#### pg

@code("./test/readme.test.ts@create-pg-connection", "typescript")

@code("./test/readme.test.ts@create-pg-pool", "typescript")

#### sqlite3

@code("./test/readme.test.ts@create-sqlite3-connection", "typescript")

#### Multiple Connection (Array)

@code("./test/readme.test.ts@create-array-connections", "typescript")

#### Multiple Connection (Object)

@code("./test/readme.test.ts@create-object-connections", "typescript")



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

@code("./src/driver/mysql/interfaces.ts@config", "typescript")

#### Postgres

Use the connection option of the `pg`.

@code("./src/driver/pg/interfaces.ts@config", "typescript")


#### Sqlite

Use the connection option of the `sqlite3`.

@code("./src/driver/sqlite3/interfaces.ts@config", "typescript")

## License

MIT

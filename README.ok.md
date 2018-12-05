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

@code("./src/interfaces/database.ts@interfaces", "typescript")

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

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

```javascript
const connection = require("async-db-adapter").create({
  adapter: "mysql"
  /* ... */
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

```typescript
type TransactionHandler<P> = (connection: Connection) => Promise<P>|P

interface Pool extends Connection {
  getConnection(): Promise<Connection>
}

interface Connection {
  close(): Promise<void>
  query(query: string, values?: any): Promise<any>
  select(query: string, values?: any): Promise<Row[]>
  first(query: string, values?: any): Promise<Row|undefined>
  transaction<P>(handler: TransactionHandler<P>): Promise<P>
}
```

## License

MIT

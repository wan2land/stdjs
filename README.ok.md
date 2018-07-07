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
  type: "mysql"
  /* ... */
})
// or import {create} from "async-db-adapter"
// create(/* ... */)
```

### Support Current Database Connection

Use `type` parameter of `create` function`s config

- mysql
- mysql-pool
- mysql2
- mysql2-pool
- pg
- pg-pool
- sqlite3

### Methods

- `close(): Promise<void>`
- `query(query: string, values?: any): Promise<any>`
- `select(query: string, values?: any): Promise<Row[]>`
- `first(query: string, values?: any): Promise<Row>`
- `transaction(handler: () => Promise<any>): Promise<void>`

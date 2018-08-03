
import "jest"

import { ConnectionConfig, create } from "../dist"

const testcases = ["mysql", "mysql-pool", "mysql2", "mysql2-pool", "pg", "pg-pool", "sqlite3"]

const configs: {[testcase: string]: ConnectionConfig} = {
  "mysql": {
    adapter: "mysql",
    host: "localhost",
    user: "root",
    database: "async_db_adapter",
  },
  "mysql-pool": {
    adapter: "mysql",
    pool: true,
    host: "localhost",
    user: "root",
    database: "async_db_adapter",
  },
  "mysql2": {
    adapter: "mysql2",
    host: "localhost",
    user: "root",
    database: "async_db_adapter",
  },
  "mysql2-pool": {
    adapter: "mysql2",
    pool: true,
    host: "localhost",
    user: "root",
    database: "async_db_adapter",
  },
  "pg": {
    adapter: "pg",
    database: "async_db_adapter",
  },
  "pg-pool": {
    adapter: "pg",
    pool: true,
    database: "async_db_adapter",
  },
  "sqlite3": {
    adapter: "sqlite3",
    filename: ":memory:",
  },
}

const beforeSqls: {[testcase: string]: string[]} = {
  "mysql": [
    "DROP TABLE IF EXISTS `tests_mysql`",
    "CREATE TABLE `tests_mysql`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
  ],
  "mysql-pool": [
    "DROP TABLE IF EXISTS `tests_mysql_pool`",
    "CREATE TABLE `tests_mysql_pool`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
  ],
  "mysql2": [
    "DROP TABLE IF EXISTS `tests_mysql2`",
    "CREATE TABLE `tests_mysql2`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
  ],
  "mysql2-pool": [
    "DROP TABLE IF EXISTS `tests_mysql2_pool`",
    "CREATE TABLE `tests_mysql2_pool`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
  ],
  "pg": [
    "DROP TABLE IF EXISTS tests_pg",
    "CREATE TABLE tests_pg(id serial PRIMARY KEY, text varchar(20) DEFAULT NULL)",
  ],
  "pg-pool": [
    "DROP TABLE IF EXISTS tests_pg_pool",
    "CREATE TABLE tests_pg_pool(id serial PRIMARY KEY, text varchar(20) DEFAULT NULL)",
  ],
  "sqlite3": [
    "DROP TABLE IF EXISTS tests_sqlite3",
    "CREATE TABLE tests_sqlite3(id INTEGER PRIMARY KEY, text TEXT)",
  ],
}

const insertOneSqls: {[testcase: string]: string} = {
  "mysql": "INSERT INTO `tests_mysql`(`text`) VALUE (\"hello1\")",
  "mysql-pool": "INSERT INTO `tests_mysql_pool`(`text`) VALUE (\"hello1\")",
  "mysql2": "INSERT INTO `tests_mysql2`(`text`) VALUE (\"hello1\")",
  "mysql2-pool": "INSERT INTO `tests_mysql2_pool`(`text`) VALUE (\"hello1\")",
  "pg": "INSERT INTO tests_pg(text) VALUES ('hello1') RETURNING id", // not exists VALUE
  "pg-pool": "INSERT INTO tests_pg_pool(text) VALUES ('hello1') RETURNING id", // not exists VALUE
  "sqlite3": "INSERT INTO tests_sqlite3(text) VALUES (\"hello1\")", // not exists VALUE
}

const insertManySqls: {[testcase: string]: [string, string[]]} = {
  "mysql": ["INSERT INTO `tests_mysql`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "mysql-pool": ["INSERT INTO `tests_mysql_pool`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "mysql2": ["INSERT INTO `tests_mysql2`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "mysql2-pool": ["INSERT INTO `tests_mysql2_pool`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "pg": ["INSERT INTO tests_pg(text) VALUES ($1), ($2) RETURNING id", ["hello2", "hello3"]],
  "pg-pool": ["INSERT INTO tests_pg_pool(text) VALUES ($1), ($2) RETURNING id", ["hello2", "hello3"]],
  "sqlite3": ["INSERT INTO tests_sqlite3(text) VALUES (?), (?)", ["hello2", "hello3"]],
}

const insertNullSqls: {[testcase: string]: [string, string[]]} = {
  "mysql": ["INSERT INTO `tests_mysql`(`text`) VALUES (?), (?)", [null, undefined]],
  "mysql-pool": ["INSERT INTO `tests_mysql_pool`(`text`) VALUES (?), (?)", [null, undefined]],
  "mysql2": ["INSERT INTO `tests_mysql2`(`text`) VALUES (?), (?)", [null, undefined]],
  "mysql2-pool": ["INSERT INTO `tests_mysql2_pool`(`text`) VALUES (?), (?)", [null, undefined]],
  "pg": ["INSERT INTO tests_pg(text) VALUES ($1), ($2) RETURNING id", [null, undefined]],
  "pg-pool": ["INSERT INTO tests_pg_pool(text) VALUES ($1), ($2) RETURNING id", [null, undefined]],
  "sqlite3": ["INSERT INTO tests_sqlite3(text) VALUES (?), (?)", [null, undefined]],
}

const selectSqls: {[testcase: string]: string} = {
  "mysql": "SELECT * FROM `tests_mysql` ORDER BY `id`",
  "mysql-pool": "SELECT * FROM `tests_mysql_pool` ORDER BY `id`",
  "mysql2": "SELECT * FROM `tests_mysql2` ORDER BY `id`",
  "mysql2-pool": "SELECT * FROM `tests_mysql2_pool` ORDER BY `id`",
  "pg": "SELECT * FROM tests_pg ORDER BY id",
  "pg-pool": "SELECT * FROM tests_pg_pool ORDER BY id",
  "sqlite3": "SELECT * FROM tests_sqlite3 ORDER BY id",
}

describe("connection", () => {
  it("test select", async () => {
    for (const testcase of testcases) {
      const connection = create(configs[testcase])
      for (const beforeSql of beforeSqls[testcase] || []) {
        await connection.query(beforeSql)
      }

      try {

        await connection.query(insertOneSqls[testcase])
        await connection.query(insertManySqls[testcase][0], insertManySqls[testcase][1])

        const rows = await connection.select(selectSqls[testcase])

        expect(rows).toEqual([
          {id: 1, text: "hello1"},
          {id: 2, text: "hello2"},
          {id: 3, text: "hello3"},
        ])

        await connection.close()
      } catch (e) {
        await connection.close()
        throw e
      }
    }
  })

  it("test first", async () => {
    for (const testcase of testcases) {
      const connection = create(configs[testcase])
      for (const beforeSql of beforeSqls[testcase] || []) {
        await connection.query(beforeSql)
      }

      try {
        await connection.query(insertOneSqls[testcase])

        const row = await connection.first(selectSqls[testcase])

        expect(row).toEqual({id: 1, text: "hello1"})

        await connection.close()
      } catch (e) {
        await connection.close()
        throw e
      }
    }
  })

  it("test insert null", async () => {
    for (const testcase of testcases) {
      const connection = create(configs[testcase])
      for (const beforeSql of beforeSqls[testcase] || []) {
        await connection.query(beforeSql)
      }

      try {

        await connection.query(insertNullSqls[testcase][0], insertNullSqls[testcase][1])

        const rows = await connection.select(selectSqls[testcase])

        expect(rows).toEqual([
          {id: 1, text: null},
          {id: 2, text: null},
        ])

        await connection.close()
      } catch (e) {
        await connection.close()
        throw e
      }
    }
  })

  it("test transaction success", async () => {
    for (const testcase of testcases) {
      const connection = create(configs[testcase])
      for (const beforeSql of beforeSqls[testcase] || []) {
        await connection.query(beforeSql)
      }

      try {
        const result = await connection.transaction(async (conn) => {
          await conn.query(insertOneSqls[testcase])
          return 1
        })

        expect(result).toEqual(1)

        const row = await connection.first(selectSqls[testcase])
        expect(row).toEqual({id: 1, text: "hello1"})

        await connection.close()
      } catch (e) {
        await connection.close()
        throw e
      }
    }
  })

  it("test transaction fail", async () => {
    for (const testcase of testcases) {
      const connection = create(configs[testcase])
      for (const beforeSql of beforeSqls[testcase] || []) {
        await connection.query(beforeSql)
      }

      try {
        try {
          await connection.transaction(async (conn) => {
            await conn.query(insertOneSqls[testcase])
            throw new Error("!!!")
          })
        } catch (e) {
          expect(e.message).toEqual("!!!")
        }

        const row = await connection.first(selectSqls[testcase])
        expect(row).toBeUndefined()

        await connection.close()
      } catch (e) {
        await connection.close()
        throw e
      }
    }
  })
})

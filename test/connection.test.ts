
import "jest"

import { connect } from "./utils"

const testcases = ["cluster", "mysql", "mysql-pool", "mysql2", "mysql2-pool", "pg", "pg-pool", "sqlite3"]

const insertOneSqls: {[testcase: string]: string} = {
  "cluster": "INSERT INTO `tests_cluster`(`text`) VALUE (\"hello1\")",
  "mysql": "INSERT INTO `tests_mysql`(`text`) VALUE (\"hello1\")",
  "mysql-pool": "INSERT INTO `tests_mysql_pool`(`text`) VALUE (\"hello1\")",
  "mysql2": "INSERT INTO `tests_mysql2`(`text`) VALUE (\"hello1\")",
  "mysql2-pool": "INSERT INTO `tests_mysql2_pool`(`text`) VALUE (\"hello1\")",
  "pg": "INSERT INTO tests_pg(text) VALUES ('hello1') RETURNING id", // not exists VALUE
  "pg-pool": "INSERT INTO tests_pg_pool(text) VALUES ('hello1') RETURNING id", // not exists VALUE
  "sqlite3": "INSERT INTO tests_sqlite3(text) VALUES (\"hello1\")", // not exists VALUE
}

const insertManySqls: {[testcase: string]: [string, string[]]} = {
  "cluster": ["INSERT INTO `tests_cluster`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "mysql": ["INSERT INTO `tests_mysql`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "mysql-pool": ["INSERT INTO `tests_mysql_pool`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "mysql2": ["INSERT INTO `tests_mysql2`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "mysql2-pool": ["INSERT INTO `tests_mysql2_pool`(`text`) VALUES (?), (?)", ["hello2", "hello3"]],
  "pg": ["INSERT INTO tests_pg(text) VALUES ($1), ($2) RETURNING id", ["hello2", "hello3"]],
  "pg-pool": ["INSERT INTO tests_pg_pool(text) VALUES ($1), ($2) RETURNING id", ["hello2", "hello3"]],
  "sqlite3": ["INSERT INTO tests_sqlite3(text) VALUES (?), (?)", ["hello2", "hello3"]],
}

const insertNullSqls: {[testcase: string]: [string, any[]]} = {
  "cluster": ["INSERT INTO `tests_cluster`(`text`) VALUES (?), (?)", [null, undefined]],
  "mysql": ["INSERT INTO `tests_mysql`(`text`) VALUES (?), (?)", [null, undefined]],
  "mysql-pool": ["INSERT INTO `tests_mysql_pool`(`text`) VALUES (?), (?)", [null, undefined]],
  "mysql2": ["INSERT INTO `tests_mysql2`(`text`) VALUES (?), (?)", [null, undefined]],
  "mysql2-pool": ["INSERT INTO `tests_mysql2_pool`(`text`) VALUES (?), (?)", [null, undefined]],
  "pg": ["INSERT INTO tests_pg(text) VALUES ($1), ($2) RETURNING id", [null, undefined]],
  "pg-pool": ["INSERT INTO tests_pg_pool(text) VALUES ($1), ($2) RETURNING id", [null, undefined]],
  "sqlite3": ["INSERT INTO tests_sqlite3(text) VALUES (?), (?)", [null, undefined]],
}

const selectSqls: {[testcase: string]: string} = {
  "cluster": "SELECT * FROM `tests_cluster` ORDER BY `id`",
  "mysql": "SELECT * FROM `tests_mysql` ORDER BY `id`",
  "mysql-pool": "SELECT * FROM `tests_mysql_pool` ORDER BY `id`",
  "mysql2": "SELECT * FROM `tests_mysql2` ORDER BY `id`",
  "mysql2-pool": "SELECT * FROM `tests_mysql2_pool` ORDER BY `id`",
  "pg": "SELECT * FROM tests_pg ORDER BY id",
  "pg-pool": "SELECT * FROM tests_pg_pool ORDER BY id",
  "sqlite3": "SELECT * FROM tests_sqlite3 ORDER BY id",
}

describe("connection", () => {
  for (const testcase of testcases) {
    it(`test select on ${testcase}`, async () => {
      const connection = await connect(testcase)
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
    })

    it(`test first on ${testcase}`, async () => {
      const connection = await connect(testcase)

      try {
        await connection.query(insertOneSqls[testcase])

        const row = await connection.first(selectSqls[testcase])

        expect(row).toEqual({id: 1, text: "hello1"})

        await connection.close()
      } catch (e) {
        await connection.close()
        throw e
      }
    })

    it(`test insert null on ${testcase}`, async () => {
      const connection = await connect(testcase)

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
    })

    it(`test transaction success on ${testcase}`, async () => {
      const connection = await connect(testcase)

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
    })

    it(`test transaction fail on ${testcase}`, async () => {
      const connection = await connect(testcase)

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
    })
  }
})

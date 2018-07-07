
import { create } from "../dist/create"
import { MysqlConnection } from "../dist/driver/mysql/connection"
import { MysqlPoolConnection } from "../dist/driver/mysql/pool-connection"
import { Sqlite3Connection } from "../dist/driver/sqlite3/connection"
import { PgConnection } from "../dist/driver/pg/connection"
import { PgPool } from "../dist/driver/pg/pool"

require("jest") // tslint:disable-line

const dbconf = {
  host: "localhost",
  user: "root",
  database: "sakila",
}

describe("create", () => {
  it("test create mysql connection", async () => {
    const connection = create({type: "mysql", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlConnection)
    await connection.close()
  })

  it("test create mysql pool connection", async () => {
    const connection = create({type: "mysql-pool", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlPoolConnection)
    await connection.close()
  })

  it("test create mysql2 connection", async () => {
    const connection = create({type: "mysql2", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlConnection)

    // console.log(await connection.select("select * from actor limit 3"))
    await connection.close()
  })

  it("test create mysql2 pool connection", async () => {
    const connection = create({type: "mysql2-pool", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlPoolConnection)
    await connection.close()
  })

  it("test create sqlite3 connection", async () => {
    const connection = create({type: "sqlite3", filename: ":memory:"})
    expect(connection).toBeInstanceOf(Sqlite3Connection)
    await connection.close()
  })

  it("test create pg connection", async () => {
    const connection = create({type: "pg"})
    expect(connection).toBeInstanceOf(PgConnection)
    await connection.close()
  })

  it("test create pg pool connection", async () => {
    const connection = create({type: "pg-pool"})
    expect(connection).toBeInstanceOf(PgPool)
    await connection.close()
  })
})

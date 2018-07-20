
import { create } from "../dist/create"
import { MysqlConnection } from "../dist/driver/mysql/connection"
import { MysqlPool } from "../dist/driver/mysql/pool"
import { PgConnection } from "../dist/driver/pg/connection"
import { PgPool } from "../dist/driver/pg/pool"
import { Sqlite3Connection } from "../dist/driver/sqlite3/connection"

require("jest") // tslint:disable-line

const dbconf = {
  host: "localhost",
  user: "root",
  database: "sakila",
}

describe("create", () => {
  it("test create mysql connection", async () => {
    const connection = create({adapter: "mysql", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlConnection)
    await connection.close()
  })

  it("test create mysql pool connection", async () => {
    const connection = create({adapter: "mysql-pool", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlPool)
    await connection.close()
  })

  it("test create mysql2 connection", async () => {
    const connection = create({adapter: "mysql2", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlConnection)

    // console.log(await connection.select("select * from actor limit 3"))
    await connection.close()
  })

  it("test create mysql2 pool connection", async () => {
    const connection = create({adapter: "mysql2-pool", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlPool)
    await connection.close()
  })

  it("test create sqlite3 connection", async () => {
    const connection = create({adapter: "sqlite3", filename: ":memory:"})
    expect(connection).toBeInstanceOf(Sqlite3Connection)
    await connection.close()
  })

  it("test create pg connection", async () => {
    const connection = create({adapter: "pg"})
    expect(connection).toBeInstanceOf(PgConnection)
    await connection.close()
  })

  it("test create pg pool connection", async () => {
    const connection = create({adapter: "pg-pool"})
    expect(connection).toBeInstanceOf(PgPool)
    await connection.close()
  })
})

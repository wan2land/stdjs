
import {create} from "../dist/create"
import {MysqlConnection} from "../dist/driver/mysql/connection"
import {MysqlPoolConnection} from "../dist/driver/mysql/pool-connection"

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
})

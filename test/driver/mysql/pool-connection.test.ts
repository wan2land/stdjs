
import { createPool } from "mysql"
import { MysqlPoolConnection } from "../../../dist/driver/mysql/pool-connection"

require("jest") // tslint:disable-line

const dbconf = {
  host: "localhost",
  user: "root",
  database: "sakila",
}

describe("mysql", () => {
  it("test select", async () => {
    const connection = new MysqlPoolConnection(createPool(dbconf))
    const users = await connection.select("select * from actor order by actor_id desc limit 3")

    expect(users).toHaveLength(3)

    await connection.close()
  })
})

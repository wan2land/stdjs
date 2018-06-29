
import {createConnection} from "mysql"
import {MysqlConnection} from "../../../dist/driver/mysql/connection"

require("jest") // tslint:disable-line

const dbconf = {
  host: "localhost",
  user: "root",
  database: "sakila",
}

describe("mysql", () => {
  it("test select", async () => {
    const connection = new MysqlConnection(createConnection(dbconf))
    const users = await connection.select("select * from actor order by actor_id desc limit 3")

    expect(users).toHaveLength(3)

    await connection.close()
  })
})

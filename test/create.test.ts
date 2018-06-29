
import {create} from "../dist/create"
import {MysqlConnection} from "../dist/connection/mysql"
import {MysqlPoolConnection} from "../dist/connection/mysql-pool"

require("jest") // tslint:disable-line

const dbconf = {
  host: "localhost",
  username: "root",
  database: "sakila",
}

describe("create", () => {
  it("test create mysql connection", () => {
    const connection = create({type: "mysql", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlConnection)
  })

  it("test create mysql connection", () => {
    const connection = create({type: "mysql-pool", ...dbconf})
    expect(connection).toBeInstanceOf(MysqlPoolConnection)
  })
})

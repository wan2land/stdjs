
import {Database} from "sqlite3"
import {Sqlite3Connection} from "../../../dist/driver/sqlite3/connection"

require("jest") // tslint:disable-line

describe("sqlite3", () => {

  it("test select", async () => {
    const connection = new Sqlite3Connection(new Database(":memory:"))

    await connection.query("create table users(id integer primary key asc, name text)")
    const result = await connection.query(`insert into users (name) values ("Jack"), ("Cris")`)

    // result is Statement object
    expect({...result}).toEqual({
      sql: `insert into users (name) values ("Jack"), ("Cris")`,
      changes: 2,
      lastID: 2,
    })

    const users = await connection.select("select * from users order by id")

    expect(users).toEqual([{id: 1, name: "Jack"}, {id: 2, name: "Cris"}])

    await connection.close()
  })

  it("test first", async () => {
    const connection = new Sqlite3Connection(new Database(":memory:"))

    await connection.query("create table users(id integer primary key asc, name text)")
    await connection.query(`insert into users (name) values ("Jack"), ("Cris")`)

    const user = await connection.first("select * from users order by id")

    expect(user).toEqual({id: 1, name: "Jack"})

    await connection.close()
  })
})


import { Pool } from "pg"
import { PgPool } from "../../../dist"

require("jest") // tslint:disable-line

describe("pg", () => {

  it("test select", async () => {
    const connection = new PgPool(new Pool())

    await connection.query("drop table if exists users")
    await connection.query("create table users(id bigserial primary key, name varchar(20) not null)")
    const result = await connection.query(`insert into users (name) values ('Jack'), ('Cris')`)

    expect(result.command).toEqual("INSERT")
    expect(result.rowCount).toEqual(2)

    const users = await connection.select("select * from users order by id")

    expect(users).toEqual([{id: "1", name: "Jack"}, {id: "2", name: "Cris"}])

    await connection.query("drop table users")
    await connection.close()
  })

  it("test first", async () => {
    const connection = new PgPool(new Pool())

    await connection.query("drop table if exists users")
    await connection.query("create table users(id bigserial primary key, name varchar(20) not null)")
    await connection.query(`insert into users (name) values ('Jack'), ('Cris')`)

    const user = await connection.first("select * from users order by id")

    expect(user).toEqual({id: "1", name: "Jack"})

    await connection.query("drop table users")
    await connection.close()
  })

  it("test transaction success", async () => {
    const connection = new PgPool(new Pool())

    await connection.query("drop table if exists users")
    await connection.query("create table users(id bigserial primary key, name varchar(20) not null)")

    const result = await connection.transaction(async (conn) => {
      await conn.query(`insert into users (name) values ('Jack')`)
      return 1
    })

    const users = await connection.select("select * from users order by id")

    expect(users).toEqual([{id: "1", name: "Jack"}])
    expect(result).toEqual(1)

    await connection.query("drop table users")
    await connection.close()
  })

  it("test transaction fail", async () => {
    const connection = new PgPool(new Pool())

    await connection.query("drop table if exists users")
    await connection.query("create table users(id bigserial primary key, name varchar(20) not null)")

    try {
      await connection.transaction(async (conn) => {
        await conn.query(`insert into users (name) values ('Jack')`)
        throw new Error("error..!!!")
      })
    } catch (e) {
      expect(e.message).toEqual("error..!!!")
    }

    const users = await connection.select("select * from users order by id")

    expect(users).toEqual([])

    await connection.query("drop table users")
    await connection.close()
  })
})

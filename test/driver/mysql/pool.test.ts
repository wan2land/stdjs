
import { createPool } from "mysql"
import { MysqlPool, Pool } from "../../../dist"

require("jest") // tslint:disable-line

const dbconf = {
  host: "localhost",
  user: "root",
  database: "sakila",
}

async function setup(): Promise<Pool> {
  const connection = new MysqlPool(createPool(dbconf))
  await connection.query(`DROP TABLE IF EXISTS \`users\``)
  await connection.query(`CREATE TABLE \`users\` (
    \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
    \`name\` varchar(20) DEFAULT NULL,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`)
  return connection
}

async function teardown(connection: Pool): Promise<void> {
  await connection.query(`DROP TABLE \`users\``)
  await connection.close()
}

describe("mysql connection", () => {
  it("test select", async () => {
    const connection = await setup()

    await connection.query(`insert into users (name) values ('Jack'), ('Cris')`)

    const users = await connection.select("select * from users order by id")

    expect(users).toEqual([{id: 1, name: "Jack"}, {id: 2, name: "Cris"}])

    await teardown(connection)
  })

  it("test first", async () => {
    const connection = await setup()

    await connection.query(`insert into users (name) values ('Jack'), ('Cris')`)

    const user = await connection.first("select * from users order by id")

    expect(user).toEqual({id: 1, name: "Jack"})

    await teardown(connection)
  })

  it("test transaction success", async () => {
    const connection = await setup()

    const result = await connection.transaction(async (conn) => {
      await conn.query(`insert into users (name) values ('Jack')`)
      return 1
    })

    const users = await connection.select("select * from users order by id")

    expect(users).toEqual([{id: 1, name: "Jack"}])
    expect(result).toEqual(1)

    await teardown(connection)
  })

  it("test transaction fail", async () => {
    const connection = await setup()

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

    await teardown(connection)
  })
})

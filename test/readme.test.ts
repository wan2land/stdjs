
import "jest"

import { create, Mysql2Connection, Mysql2Pool, MysqlConnection, MysqlPool, PgConnection, PgPool, Sqlite3Connection } from "../dist"

describe("readmd", () => {

  const mysqlConfig = {
    host: "localhost",
    user: "root",
    database: "async_db_adapter",
  }
  const pgConfig = {}

  it("test create mysql connection", async () => {
    // section:create-mysql-connection
    const connection = create({
      adapter: "mysql",
      ...mysqlConfig,
    }) // return instanceof MysqlConnection
    // endsection

    expect(connection).toBeInstanceOf(MysqlConnection)

    await connection.close()
  })

  it("test create mysql pool connection", async () => {
    // section:create-mysql-pool
    const connection = create({
      adapter: "mysql",
      pool: true,
      ...mysqlConfig,
    }) // return instanceof MysqlPool
    // endsection

    expect(connection).toBeInstanceOf(MysqlPool)

    await connection.close()
  })

  it("test create mysql2 connection", async () => {
    // section:create-mysql2-connection
    const connection = create({
      adapter: "mysql2",
      ...mysqlConfig,
    }) // return instanceof Mysql2Connection
    // endsection

    expect(connection).toBeInstanceOf(Mysql2Connection)

    await connection.close()
  })

  it("test create mysql2 pool connection", async () => {
    // section:create-mysql2-pool
    const connection = create({
      adapter: "mysql2",
      pool: true,
      ...mysqlConfig,
    }) // return instanceof Mysql2Pool
    // endsection

    expect(connection).toBeInstanceOf(Mysql2Pool)

    await connection.close()
  })

  it("test create pg connection", async () => {
    // section:create-pg-connection
    const connection = create({
      adapter: "pg",
      ...pgConfig,
    }) // return instanceof PgConnection
    // endsection

    expect(connection).toBeInstanceOf(PgConnection)

    await connection.close()
  })

  it("test create pg pool connection", async () => {
    // section:create-pg-pool
    const connection = create({
      adapter: "pg",
      pool: true,
      ...pgConfig,
    }) // return instanceof PgPool
    // endsection

    expect(connection).toBeInstanceOf(PgPool)

    await connection.close()
  })

  it("test create sqlite3 connection", async () => {
    // section:create-sqlite3-connection
    const connection = create({
      adapter: "sqlite3",
      filename: ":memory:",
    }) // return instanceof Sqlite3Connection
    // endsection

    expect(connection).toBeInstanceOf(Sqlite3Connection)

    await connection.close()
  })

  it("test create array connections", async () => {
    // section:create-array-connections
    const connections = create([
      {
        adapter: "mysql2",
        pool: true,
        ...mysqlConfig,
      },
      {
        adapter: "pg",
        pool: true,
        ...pgConfig,
      },
      {
        adapter: "sqlite3",
        filename: ":memory:",
      },
    ]) // return instanceof [MysqlPool, PgPool, Sqlite3Connection]
    // endsection

    expect(connections.length).toEqual(3)
    expect(connections[0]).toBeInstanceOf(MysqlPool)
    expect(connections[1]).toBeInstanceOf(PgPool)
    expect(connections[2]).toBeInstanceOf(Sqlite3Connection)

    await Promise.all(connections.map(connection => connection.close()))
  })

  it("test create object connections", async () => {
    // section:create-object-connections
    const connections = create({
      default: {
        adapter: "mysql2",
        pool: true,
        ...mysqlConfig,
      },
      pg: {
        adapter: "pg",
        pool: true,
        ...pgConfig,
      },
      sqlite: {
        adapter: "sqlite3",
        filename: ":memory:",
      },
    }) // return instanceof {default: MysqlPool, pg: PgPool, sqlite: Sqlite3Connection}
    // endsection

    expect(connections.default).toBeInstanceOf(MysqlPool)
    expect(connections.pg).toBeInstanceOf(PgPool)
    expect(connections.sqlite).toBeInstanceOf(Sqlite3Connection)

    await Promise.all(Object.keys(connections).map(key => connections[key].close()))
  })
})

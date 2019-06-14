import {
  ClusterConnection,
  create,
  Mysql2Connection,
  Mysql2Pool,
  MysqlConnection,
  MysqlPool,
  PgConnection,
  PgPool,
  Sqlite3Connection,
} from "../lib"
import { config } from "./utils"


describe("readmd", () => {

  it("test create mysql connection", async () => {
    const mysqlConfig = await config("mysql") as {}

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
    const mysqlConfig = await config("mysql-pool") as {}

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
    const mysqlConfig = await config("mysql2") as {}

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
    const mysqlConfig = await config("mysql2-pool") as {}

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
    const pgConfig = await config("pg") as {}

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
    const pgConfig = await config("pg-pool") as {}

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

  it("test create cluster connection", async () => {
    const mysqlConfig = await config("mysql2-pool") as {}

    // section:create-cluster-connection
    const connection = create({
      adapter: "cluster",
      write: {
        adapter: "mysql2",
        pool: true,
        host: "stdjs-database.cluster-abcdef1234.ap-somewhere.rds.amazonaws.com",
        ...mysqlConfig,
      },
      read: {
        adapter: "mysql2",
        pool: true,
        host: "stdjs-database.cluster-ro-abcdef1234.ap-somewhere.rds.amazonaws.com",
        ...mysqlConfig,
      },
    }) // return instanceof ClusterConnection
    // endsection

    expect(connection).toBeInstanceOf(ClusterConnection)

    await connection.close()
  })
})

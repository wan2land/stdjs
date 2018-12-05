import { exec } from "child_process"
import { Connection, ConnectionConfig, create } from "../dist"

const dockercache = new Map<string, [string, number]>()
function getDockerComposePort(service: string, port: number): Promise<[string, number]> {
  const cachekey = `${service}___${port}`
  return new Promise((resolve, reject) => {
    if (dockercache.has(cachekey)) {
      return resolve(dockercache.get(cachekey))
    }
    exec(`docker-compose port ${service} ${port}`, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      const chunks = stdout.trim().split(":")
      const result: [string, number] = [chunks[0], parseInt(chunks[1], 10)]
      dockercache.set(cachekey, result)
      resolve(result)
    })
  })
}

export async function config(testcase: string): Promise<ConnectionConfig> {
  const [mariadb100Host, mariadb100Port] = await getDockerComposePort("mariadb10.0", 3306)
  const [postgres96Host, postgres96Port] = await getDockerComposePort("postgres9.6", 5432)
  if (testcase === "mysql") {
    return {
      adapter: "mysql",
      host: "localhost",
      port: mariadb100Port,
      user: "root",
      password: "mariadb",
      database: "stdjs_database",
    }
  }
  if (testcase === "mysql-pool") {
    return {
      adapter: "mysql",
      pool: true,
      host: "localhost",
      port: mariadb100Port,
      user: "root",
      password: "mariadb",
      database: "stdjs_database",
    }
  }
  if (testcase === "mysql2") {
    return {
      adapter: "mysql2",
      host: "localhost",
      port: mariadb100Port,
      user: "root",
      password: "mariadb",
      database: "stdjs_database",
    }
  }
  if (testcase === "mysql2-pool") {
    return {
      adapter: "mysql2",
      pool: true,
      host: "localhost",
      port: mariadb100Port,
      user: "root",
      password: "mariadb",
      database: "stdjs_database",
    }
  }
  if (testcase === "pg") {
    return {
      adapter: "pg",
      host: "localhost",
      port: postgres96Port,
      user: "postgres",
      password: "postgres",
      database: "stdjs_database",
    }
  }
  if (testcase === "pg-pool") {
    return {
      adapter: "pg",
      pool: true,
      host: "localhost",
      port: postgres96Port,
      user: "postgres",
      password: "postgres",
      database: "stdjs_database",
    }
  }
  if (testcase === "sqlite3") {
    return {
      adapter: "sqlite3",
      filename: ":memory:",
    }
  }
  throw new Error(`unknown testcase ${testcase}`)
}
export async function connect(testcase: string): Promise<Connection> {
  const connection = create(await config(testcase))
  if (testcase === "mysql") {
    await connection.query("DROP TABLE IF EXISTS `tests_mysql`")
    await connection.query("CREATE TABLE `tests_mysql`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB")
  } else if (testcase === "mysql-pool") {
    await connection.query("DROP TABLE IF EXISTS `tests_mysql_pool`")
    await connection.query("CREATE TABLE `tests_mysql_pool`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB")
  } else if (testcase === "mysql2") {
    await connection.query("DROP TABLE IF EXISTS `tests_mysql2`")
    await connection.query("CREATE TABLE `tests_mysql2`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB")
  } else if (testcase === "mysql2-pool") {
    await connection.query("DROP TABLE IF EXISTS `tests_mysql2_pool`")
    await connection.query("CREATE TABLE `tests_mysql2_pool`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB")
  } else if (testcase === "pg") {
    await connection.query("DROP TABLE IF EXISTS tests_pg")
    await connection.query("CREATE TABLE tests_pg(id serial PRIMARY KEY, text varchar(20) DEFAULT NULL)")
  } else if (testcase === "pg-pool") {
    await connection.query("DROP TABLE IF EXISTS tests_pg_pool")
    await connection.query("CREATE TABLE tests_pg_pool(id serial PRIMARY KEY, text varchar(20) DEFAULT NULL)")
  } else if (testcase === "sqlite3") {
    await connection.query("DROP TABLE IF EXISTS tests_sqlite3")
    await connection.query("CREATE TABLE tests_sqlite3(id INTEGER PRIMARY KEY, text TEXT)")
  }
  return connection
}

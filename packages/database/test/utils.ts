import { exec } from 'child_process'

import { Connection, createConnection, createCluster } from '../lib'
import { MysqlConnector } from '../lib/driver/mysql'
import { Mysql2Connector } from '../lib/driver/mysql2'
import { PgConnector } from '../lib/driver/pg'
import { Sqlite3Connector } from '../lib/driver/sqlite3'


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
      const chunks = stdout.trim().split(':')
      const result: [string, number] = [chunks[0], parseInt(chunks[1], 10)]
      dockercache.set(cachekey, result)
      resolve(result)
    })
  })
}

export type Testcase = 'mysql' | 'mysql-pool' | 'mysql2' | 'mysql2-pool' | 'pg' | 'pg-pool' | 'sqlite3' | 'cluster'


export async function connect(testcase: Testcase): Promise<Connection> {
  const [mariadb100Host, mariadb100Port] = await getDockerComposePort('mariadb10.0', 3306)
  const [postgres96Host, postgres96Port] = await getDockerComposePort('postgres9.6', 5432)

  if (testcase === 'mysql') {
    const connection = createConnection(new MysqlConnector({
      host: 'localhost',
      port: mariadb100Port,
      user: 'root',
      password: 'mariadb',
      database: 'stdjs_database',
    }))
    await connection.query('DROP TABLE IF EXISTS `tests_mysql`')
    await connection.query('CREATE TABLE `tests_mysql`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    return connection
  }
  if (testcase === 'mysql-pool') {
    const connection = createConnection(new MysqlConnector({
      pool: true,
      host: 'localhost',
      port: mariadb100Port,
      user: 'root',
      password: 'mariadb',
      database: 'stdjs_database',
    }))
    await connection.query('DROP TABLE IF EXISTS `tests_mysql_pool`')
    await connection.query('CREATE TABLE `tests_mysql_pool`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    return connection
  }
  if (testcase === 'mysql2') {
    const connection = createConnection(new Mysql2Connector({
      host: 'localhost',
      port: mariadb100Port,
      user: 'root',
      password: 'mariadb',
      database: 'stdjs_database',
    }))
    await connection.query('DROP TABLE IF EXISTS `tests_mysql2`')
    await connection.query('CREATE TABLE `tests_mysql2`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    return connection
  }
  if (testcase === 'mysql2-pool') {
    const connection = createConnection(new Mysql2Connector({
      pool: true,
      host: 'localhost',
      port: mariadb100Port,
      user: 'root',
      password: 'mariadb',
      database: 'stdjs_database',
    }))
    await connection.query('DROP TABLE IF EXISTS `tests_mysql2_pool`')
    await connection.query('CREATE TABLE `tests_mysql2_pool`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    return connection
  }
  if (testcase === 'pg') {
    const connection = createConnection(new PgConnector({
      host: 'localhost',
      port: postgres96Port,
      user: 'postgres',
      password: 'postgres',
      database: 'stdjs_database',
    }))
    await connection.query('DROP TABLE IF EXISTS tests_pg')
    await connection.query('CREATE TABLE tests_pg(id serial PRIMARY KEY, text varchar(20) DEFAULT NULL)')
    return connection
  }
  if (testcase === 'pg-pool') {
    const connection = createConnection(new PgConnector({
      pool: true,
      host: 'localhost',
      port: postgres96Port,
      user: 'postgres',
      password: 'postgres',
      database: 'stdjs_database',
    }))
    await connection.query('DROP TABLE IF EXISTS tests_pg_pool')
    await connection.query('CREATE TABLE tests_pg_pool(id serial PRIMARY KEY, text varchar(20) DEFAULT NULL)')
    return connection
  }
  if (testcase === 'sqlite3') {
    const connection = createConnection(new Sqlite3Connector({
      filename: ':memory:',
    }))
    await connection.query('DROP TABLE IF EXISTS tests_sqlite3')
    await connection.query('CREATE TABLE tests_sqlite3(id INTEGER PRIMARY KEY, text TEXT)')
    return connection
  }
  if (testcase === 'cluster') {
    const connection = createCluster({
      read: new Mysql2Connector({
        pool: true,
        host: 'localhost',
        port: mariadb100Port,
        user: 'root',
        password: 'mariadb',
        database: 'stdjs_database',
      }),
      write: new Mysql2Connector({
        pool: true,
        host: 'localhost',
        port: mariadb100Port,
        user: 'root',
        password: 'mariadb',
        database: 'stdjs_database',
      }),
    })
    await connection.query('DROP TABLE IF EXISTS `tests_cluster`')
    await connection.query('CREATE TABLE `tests_cluster`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    return connection
  }
  throw new Error(`unknown testcase ${testcase}`)
}


import {Connection} from "mysql"

export function beginTransaction(connection: Connection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export function commit(connection: Connection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export function rollback(connection: Connection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export async function transaction(connection: Connection, handler: () => Promise<any>): Promise<void> {
  await beginTransaction(connection)
  try {
    await handler()
    await commit(connection)
  } catch (e) {
    await rollback(connection)
    throw e
  }
}

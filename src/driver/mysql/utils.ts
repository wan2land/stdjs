
import {Connection, TransactionHandler} from "../../interfaces/interfaces"
import {MysqlRawConnection} from "../../interfaces/mysql"

export function beginTransaction(connection: MysqlRawConnection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export function commit(connection: MysqlRawConnection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export function rollback(connection: MysqlRawConnection): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export async function transaction<P>(
    raw: MysqlRawConnection,
    connection: Connection,
    handler: TransactionHandler<P>): Promise<P> {

  await beginTransaction(raw)
  try {
    const ret = await handler(connection)
    await commit(raw)
    return ret
  } catch (e) {
    await rollback(raw)
    throw e
  }
}

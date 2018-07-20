
import { MysqlRawConnection } from "./interfaces"

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

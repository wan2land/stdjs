import { Connection, Connector } from '../interfaces/database'

export function createConnection(connector: Connector): Connection {
  return connector.connect()
}

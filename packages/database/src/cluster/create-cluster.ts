import { Connection, Connector } from '../interfaces/database'
import { ClusterConnection } from './connection'

export interface CreateClusterOptions {
  read: Connector
  write: Connector
}

export function createCluster(options: CreateClusterOptions): Connection {
  return new ClusterConnection(
    options.read.connect(),
    options.write.connect()
  )
}

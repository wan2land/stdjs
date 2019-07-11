import { Connection, QueryBuilder, QueryResult, Row, Scalar, TransactionHandler } from '../../interfaces/database'


export class ClusterConnection implements Connection {

  public constructor(public read: Connection, public write: Connection) {
  }

  public async close(): Promise<void> {
    await Promise.all([
      this.write.close(),
      this.read.close(),
    ])
  }

  public first<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []) {
    return this.read.first<TRow>(queryOrQb as any, values)
  }

  public firstOrThrow<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []) {
    return this.read.firstOrThrow<TRow>(queryOrQb as any, values)
  }

  public select<TRow extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []) {
    return this.read.select<TRow>(queryOrQb as any, values)
  }

  public query(queryOrQb: string|QueryBuilder, values: Scalar[] = []) {
    return this.write.query(queryOrQb as any, values)
  }

  public transaction<TRet>(handler: TransactionHandler<TRet>): Promise<TRet> {
    return this.read.transaction((read) => {
      return this.write.transaction((write) => {
        return handler(new ClusterConnection(read, write))
      })
    })
  }
}

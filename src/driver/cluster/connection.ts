import { Connection, QueryBuilder, QueryResult, Row, Scalar, TransactionHandler } from "../../interfaces/database"


export class ClusterConnection implements Connection {

  public constructor(public read: Connection, public write: Connection) {
  }

  public async close(): Promise<void> {
    await Promise.all([
      this.write.close(),
      this.read.close(),
    ])
  }

  public first<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P|undefined> {
    return this.read.first<P>(queryOrQb as any, values)
  }

  public firstOrThrow<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P|undefined> {
    return this.read.firstOrThrow<P>(queryOrQb as any, values)
  }

  public select<P extends Row>(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<P[]> {
    return this.read.select<P>(queryOrQb as any, values)
  }

  public query(queryOrQb: string|QueryBuilder, values: Scalar[] = []): Promise<QueryResult> {
    return this.write.query(queryOrQb as any, values)
  }

  public async transaction<P>(handler: TransactionHandler<P>): Promise<P> {
    return await this.read.transaction(async (read) => {
      return await this.write.transaction(async (write) => {
        return await handler(new ClusterConnection(read, write))
      })
    })
  }
}

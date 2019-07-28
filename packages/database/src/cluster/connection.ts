import { Connection, Row, TransactionHandler } from '../interfaces/database'


export class ClusterConnection implements Connection {

  public constructor(public read: Connection, public write: Connection) {
  }

  public async close(): Promise<void> {
    await Promise.all([
      this.write.close(),
      this.read.close(),
    ])
  }

  public first<TRow extends Row>(query: string, values: any[] = []) {
    return this.read.first<TRow>(query as any, values)
  }

  public select<TRow extends Row>(query: string, values: any[] = []) {
    return this.read.select<TRow>(query as any, values)
  }

  public query(query: string, values: any[] = []) {
    return this.write.query(query as any, values)
  }

  public transaction<TResult>(handler: TransactionHandler<TResult>): Promise<TResult> {
    return this.write.transaction((write) => {
      return handler(new ClusterConnection(write, write))
    })
  }
}

import { MaybeArray } from "../interfaces/common"
import { RelaterOptions } from "../interfaces/relater"


export class Mapper<Entity> {

  public constructor(public readonly options: RelaterOptions<Entity>) {
  }

  public map<Source = any>(rows: Source[]): Entity[]
  public map<Source = any>(rows: Source): Entity
  public map<Source = any>(rows: MaybeArray<Source>): MaybeArray<Entity> {
    if (!Array.isArray(rows)) {
      return this.map<Source>([rows])[0]
    }
    return rows.map((row: any) => {
      const entity: any = {}
      for (const column of this.options.columns) {
        entity[column.property] = row[column.sourceKey]
      }

      Object.setPrototypeOf(entity, this.options.ctor.prototype)
      return entity
    })
  }
}

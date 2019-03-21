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

      // const relations = this.options.relations || {}
      // for (const key of Object.keys(relations)) {
      //   if (!row[key]) {
      //     continue // not exists cascades
      //   }
      //   const relation = relations[key]
      //   if (relation.related && this.loader) {
      //     const repo = this.loader.getRepository(relation.related)
      //     entity[key] = relation.type === "one-to-one"
      //       ? repo.hydrate([row[key]])[0]
      //       : repo.hydrate(row[key] || [])
      //   } else {
      //     entity[key] = row[key]
      //   }
      // }

      Object.setPrototypeOf(entity, this.options.ctor.prototype)
      return entity
    })
  }
}

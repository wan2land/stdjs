import { MaybeArray, DeepPartial } from "../interfaces/common"
import { RelaterOptions } from "../interfaces/relater"


export class Transformer<Entity, Source = any> {

  public constructor(public readonly options: RelaterOptions<Entity>) {
  }

  public toEntity(rows: Source[]): Entity[]
  public toEntity(rows: Source): Entity
  public toEntity(rows: MaybeArray<Source>): MaybeArray<Entity> {
    if (!Array.isArray(rows)) {
      return this.toEntity([rows])[0]
    }
    return rows.map((row: any) => {
      const entity: any = {}
      for (const column of this.options.columns) {
        if (row[column.sourceKey]) {
          entity[column.property] = row[column.sourceKey]
        }
      }

      Object.setPrototypeOf(entity, this.options.ctor.prototype)
      return entity
    })
  }

  public toPlain(entities: Entity[]): Source[]
  public toPlain(entities: Entity): Source
  public toPlain(entities: DeepPartial<Entity>[]): Source[]
  public toPlain(entities: DeepPartial<Entity>): Source
  public toPlain(entities: any): MaybeArray<Source> {
    if (!Array.isArray(entities)) {
      return this.toPlain([entities] as Entity[])[0]
    }
    return entities.map((entity) => {
      const row: any = {}
      for (const column of this.options.columns) {
        if (entity[column.property]) {
          row[column.sourceKey] = entity[column.property]
        }
      }
      return row
    })
  }
}

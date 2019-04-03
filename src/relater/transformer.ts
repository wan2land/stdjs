import { RelaterOptions } from "../interfaces/relater"
import { MaybeArray } from "../interfaces/utils"


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
      const entity: Partial<Entity> = {}
      for (const column of this.options.columns) {
        if (typeof row[column.sourceKey] !== "undefined") {
          entity[column.property] = row[column.sourceKey]
        }
      }

      Object.setPrototypeOf(entity, this.options.ctor.prototype)
      return entity as Entity
    })
  }

  public assign(entity: Partial<Entity>[]): Entity[]
  public assign(entity: Partial<Entity>): Entity
  public assign(entity: MaybeArray<Partial<Entity>>): MaybeArray<Entity> {
    if (!Array.isArray(entity)) {
      return Object.setPrototypeOf(entity, this.options.ctor.prototype)
    }
    return entity.map((row) => this.assign(row))
  }

  public toPlain(entities: Entity[]): Source[]
  public toPlain(entities: Entity): Source
  public toPlain(entities: Partial<Entity>[]): Source[]
  public toPlain(entities: Partial<Entity>): Source
  public toPlain(entities: any): MaybeArray<Source> {
    if (!Array.isArray(entities)) {
      return this.toPlain([entities] as Entity[])[0]
    }
    return entities.map((entity) => {
      const row: any = {}
      for (const column of this.options.columns) {
        if (typeof entity[column.property] !== "undefined") {
          row[column.sourceKey] = entity[column.property]
        }
      }
      return row
    })
  }
}

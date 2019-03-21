import { ConstructType, MaybeArray } from "../interfaces/common"
import { createOptions } from "./create-options"
import { Mapper } from "./mapper"


export function mapTo<Entity, Source = any>(rows: Source[], entity: ConstructType<Entity>): Entity[]
export function mapTo<Entity, Source = any>(rows: Source, entity: ConstructType<Entity>): Entity
export function mapTo<Entity, Source = any>(rows: MaybeArray<Source>, entity: ConstructType<Entity>): MaybeArray<Entity> {
  return new Mapper(createOptions(entity)).map(rows)
}

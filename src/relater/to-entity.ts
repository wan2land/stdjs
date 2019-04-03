import { ConstructType, MaybeArray } from "../interfaces/utils"
import { createOptions } from "./create-options"
import { Transformer } from "./transformer"


export function toEntity<Entity, Source = any>(entity: ConstructType<Entity>, rows: Source[]): Entity[]
export function toEntity<Entity, Source = any>(entity: ConstructType<Entity>, rows: Source): Entity
export function toEntity<Entity, Source = any>(entity: ConstructType<Entity>, rows: MaybeArray<Source>): MaybeArray<Entity> {
  return new Transformer<Entity, Source>(createOptions(entity)).toEntity(rows as Source[])
}

import { ConstructType, MaybeArray, DeepPartial } from "../interfaces/common"
import { createOptions } from "./create-options"
import { Transformer } from "./transformer"


export function toPlain<Entity, Source = any>(entity: ConstructType<Entity>, entities: Entity[]): Source[]
export function toPlain<Entity, Source = any>(entity: ConstructType<Entity>, entities: Entity): Source
export function toPlain<Entity, Source = any>(entity: ConstructType<Entity>, entities: DeepPartial<Entity>[]): Source[]
export function toPlain<Entity, Source = any>(entity: ConstructType<Entity>, entities: DeepPartial<Entity>): Source
export function toPlain<Entity, Source = any>(entity: ConstructType<Entity>, entities: MaybeArray<Entity>): MaybeArray<Source> {
  return new Transformer<Entity, Source>(createOptions(entity)).toPlain(entities as Entity[])
}

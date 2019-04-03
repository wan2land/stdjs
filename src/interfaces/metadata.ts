import { ColumnType, RelationType } from "./decorator"
import { ConstructFactory, MaybeFactory } from "./utils"


export interface MetadataColumn<P> {
  property: keyof P
  name: string
  type: ColumnType
  nullable: boolean
  default?: MaybeFactory<any>
}

export interface MetadataRelation<P> {
  property: keyof P
  typeFactory: ConstructFactory<any>
  type: RelationType
  key?: string
  relatedKey?: string
}

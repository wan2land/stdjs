import { ColumnType, Identifier, RelationType } from "./common"
import { TypeFactory } from "./decorator"

export interface MetadataColumn {
  target: any
  property: Identifier
  name: string
  type: ColumnType
}

export interface MetadataRelation {
  target: any
  property: Identifier
  typeFactory: TypeFactory
  type: RelationType
  key?: string
  relatedKey?: string
}

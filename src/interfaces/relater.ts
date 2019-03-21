import { ColumnType, ConstructType, Identifier } from "./common"

export interface RelaterOptions<P> {
  ctor: ConstructType<P>
  columns: {
    property: Identifier
    type: ColumnType // @todo transform
    sourceKey: string
  }[]
  relations: {
    property: Identifier
    type: "one-to-one" | "one-to-many"
    target: ConstructType<any>
    key: string
    relatedKey: string
  }[]
}

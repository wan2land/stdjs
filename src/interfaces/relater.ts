import { ColumnType } from "./decorator"
import { ConstructType } from "./utils"


export interface RelaterOptions<P> {
  ctor: ConstructType<P>
  columns: {
    property: keyof P
    sourceKey: string
    type: ColumnType // @todo transform
  }[]
  relations: {
    property: keyof P
    type: "one-to-one" | "one-to-many"
    target: ConstructType<any>
    key: string
    relatedKey: string
  }[]
}

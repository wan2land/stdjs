import { ColumnType } from "./decorator"
import { ConstructType, MaybeFactory } from "./utils"


export interface RelaterOptions<P> {
  ctor: ConstructType<P>
  columns: {
    property: keyof P
    sourceKey: string
    type: ColumnType // @todo transform
    nullable: boolean
    default?: MaybeFactory<any>
  }[]
  relations: {
    property: keyof P
    type: "one-to-one" | "one-to-many"
    target: ConstructType<any>
    key: string
    relatedKey: string
  }[]
}

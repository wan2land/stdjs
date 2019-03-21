
export type Identifier = string | symbol

export type ConstructType<P> = {new (...args: any[]): P} | Function // tslint:disable-line

export type Scalar = string | number | boolean | null

export type MaybeArray<P> = P | P[]

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type ColumnType = "string" | "number" | "int" | "float" | "boolean"

export type RelationType = "belongs-to" | "has-one" | "has-many"

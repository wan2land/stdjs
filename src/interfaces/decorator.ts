import { ConstructFactory, MaybeFactory } from "./utils"


export type ColumnType = "string" | "number" | "int" | "float" | "boolean" | "object"
export type RelationType = "belongs-to" | "has-one" | "has-many"

export interface ColumnDecoratorOptions {
  name?: string
  type?: ColumnType
  nullable?: boolean
  default?: MaybeFactory<any>
}

export interface RelationDecoratorOptions {
  key?: string
  relatedKey?: string
}

export type ColumnDecoratorFactory = (options?: ColumnDecoratorOptions) => PropertyDecorator

export type RelationDecoratorFactory = (typeFactory: ConstructFactory<any>, options?: RelationDecoratorOptions) => PropertyDecorator

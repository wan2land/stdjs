import { ColumnType, ConstructType } from "./common"

export type TypeFactory = (type: any) => ConstructType<any>

export interface ColumnDecoratorOptions {
  name?: string
  type?: ColumnType
}

export interface RelationDecoratorOptions {
  key?: string
  relatedKey?: string
}

export type ColumnDecoratorFactory = (options?: ColumnDecoratorOptions) => PropertyDecorator

export type RelationDecoratorFactory = (typeFactory: TypeFactory, options?: RelationDecoratorOptions) => PropertyDecorator

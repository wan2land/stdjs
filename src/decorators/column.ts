import { ColumnDecoratorFactory } from "../interfaces/decorator"
import { metadataColumns } from "../metadata"


export const Column: ColumnDecoratorFactory = (options = {}) => (target, property) => {
  let columns = metadataColumns.get(target.constructor)
  if (!columns) {
    columns = []
    metadataColumns.set(target.constructor, columns)
  }
  columns.push({
    property,
    name: options.name || (typeof property === "string" ? property : property.toString()),
    type: options.type || "string",
  })
}

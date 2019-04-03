import { RelationDecoratorFactory } from "../interfaces/decorator"
import { metadataRelations } from "../metadata"


export const BelongsTo: RelationDecoratorFactory = (typeFactory, options = {}) => (target, property) => {
  let relations = metadataRelations.get(target.constructor)
  if (!relations) {
    relations = []
    metadataRelations.set(target.constructor, relations)
  }
  relations.push({
    property,
    typeFactory,
    type: "belongs-to",
    key: options.key,
    relatedKey: options.relatedKey,
  })
}

import { RelationDecoratorFactory } from "../interfaces/decorator"
import { metadataRelations } from "../metadata"


export const HasOne: RelationDecoratorFactory = (typeFactory, options = {}) => (target, property) => {
  let relations = metadataRelations.get(target.constructor)
  if (!relations) {
    relations = []
    metadataRelations.set(target.constructor, relations)
  }
  relations.push({
    target,
    property,
    typeFactory,
    type: "has-one",
    key: options.key,
    relatedKey: options.relatedKey,
  })
}

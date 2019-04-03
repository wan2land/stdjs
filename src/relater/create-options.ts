import { MetadataColumn, MetadataRelation } from "../interfaces/metadata"
import { RelaterOptions } from "../interfaces/relater"
import { ConstructType } from "../interfaces/utils"
import { metadataColumns, metadataRelations } from "../metadata"


export function createOptions<Entity>(ctor: ConstructType<Entity>): RelaterOptions<Entity> {
  return {
    ctor,
    columns: ((metadataColumns.get(ctor) || []) as MetadataColumn<Entity>[]).map(({property, type, name, nullable, default: def}) => ({
      property,
      type,
      sourceKey: name,
      nullable,
      default: def,
    })),
    relations: ((metadataRelations.get(ctor) || []) as MetadataRelation<Entity>[]).map(({typeFactory, property, type, key, relatedKey}) => {
      const relationEntity = typeFactory(undefined)
      switch (type) {
        case "belongs-to":
          return {
            property,
            type: "one-to-one" as "one-to-one",
            target: relationEntity,
            key: key || `${relationEntity.name.toLocaleLowerCase()}_id`,
            relatedKey: relatedKey || "id",
          }
        case "has-one":
          return {
            property,
            type: "one-to-one" as "one-to-one",
            target: relationEntity,
            key: key || "id",
            relatedKey: relatedKey || `${relationEntity.name.toLocaleLowerCase()}_id`,
          }
        case "has-many":
          return {
            property,
            type: "one-to-many" as "one-to-many",
            target: relationEntity,
            key: key || "id",
            relatedKey: relatedKey || `${relationEntity.name.toLocaleLowerCase()}_id`,
          }
      }
    }),
  }
}

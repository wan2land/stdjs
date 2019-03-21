import { ConstructType } from "../interfaces/common"
import { RelaterOptions } from "../interfaces/relater"
import { metadataColumns, metadataRelations } from "../metadata"


export function createOptions<P>(ctor: ConstructType<P>): RelaterOptions<P> {
  return {
    ctor,
    columns: (metadataColumns.get(ctor) || []).map(({property, type, name}) => ({
      property,
      type,
      sourceKey: name,
    })),
    relations: (metadataRelations.get(ctor) || []).map(({typeFactory, property, type, key, relatedKey}) => {
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

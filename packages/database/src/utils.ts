import { QueryBuilder } from "./interfaces/database"

export function isQueryBuilder(qb: any): qb is QueryBuilder {
  return qb && typeof qb.toSql === "function" && typeof qb.getBindings === "function"
}

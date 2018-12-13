
export class RowNotFoundError extends Error {
  public code = "DB_FIRST_IS_NULL"
  constructor() {
    super("no rows found.")
  }
}


export class RowNotFoundError extends Error {
  public code = "DB_FIRST_IS_NULL"
  public constructor() {
    super("no rows found.")
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, RowNotFoundError.prototype)
  }
}

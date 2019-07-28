
export class RowNotFoundError extends Error {
  public code = 'ROW_NOT_FOUND_ERROR'
  public constructor(message: string = 'row not found.') {
    super(message)
    this.name = 'RowNotFoundError'
    Object.setPrototypeOf(this, RowNotFoundError.prototype)
  }
}

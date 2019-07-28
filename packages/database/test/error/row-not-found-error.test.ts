import { RowNotFoundError } from '../../lib'


describe('row-not-found-error', () => {
  it('instanceof', () => {
    const a = new RowNotFoundError()

    expect(a).toBeInstanceOf(RowNotFoundError)
    expect(a).toBeInstanceOf(Error)
    expect(a.name).toEqual('RowNotFoundError')
    expect(a.code).toEqual('ROW_NOT_FOUND_ERROR')
  })
})

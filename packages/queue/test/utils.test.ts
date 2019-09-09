
import 'jest'

import { scalePriority } from '../src/utils'

describe('utils.scalePriority', () => {
  it('test y = x', () => {
    const scale = scalePriority([10, 20], [10, 20])
    expect(scale(10)).toBe(10)
    expect(scale(15)).toBe(15)
    expect(scale(20)).toBe(20)
  })

  it('test y = 2x', () => {
    const scale = scalePriority([10, 20], [20, 40])
    expect(scale(10)).toBe(20)
    expect(scale(15)).toBe(30)
    expect(scale(20)).toBe(40)
  })

  it('test y = x/2', () => {
    const scale = scalePriority([10, 20], [5, 10])
    expect(scale(10)).toBe(5)
    expect(scale(15)).toBe(8)
    expect(scale(20)).toBe(10)
  })

  it('test y = x/2 + 10', () => {
    const scale = scalePriority([10, 20], [15, 20])
    expect(scale(10)).toBe(15)
    expect(scale(15)).toBe(18)
    expect(scale(20)).toBe(20)
  })
})

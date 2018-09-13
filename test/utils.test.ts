
import "jest"

import { priorityScale } from "../src/utils"

describe("utils.priorityScale", () => {
  it("test y = x", async () => {
    const scale = priorityScale([10, 20], [10, 20])
    expect(scale(10)).toBe(10)
    expect(scale(15)).toBe(15)
    expect(scale(20)).toBe(20)
  })

  it("test y = 2x", async () => {
    const scale = priorityScale([10, 20], [20, 40])
    expect(scale(10)).toBe(20)
    expect(scale(15)).toBe(30)
    expect(scale(20)).toBe(40)
  })

  it("test y = x/2", async () => {
    const scale = priorityScale([10, 20], [5, 10])
    expect(scale(10)).toBe(5)
    expect(scale(15)).toBe(8)
    expect(scale(20)).toBe(10)
  })

  it("test y = x/2 + 10", async () => {
    const scale = priorityScale([10, 20], [15, 20])
    expect(scale(10)).toBe(15)
    expect(scale(15)).toBe(18)
    expect(scale(20)).toBe(20)
  })
})

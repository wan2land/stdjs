
import {} from "jest"

import * as bottler from "../dist"

describe("bottler", () => {
  it("exists shared", () => {
    expect.assertions(1)
    expect(bottler.Container.shared).toBeInstanceOf(bottler.Container)
  })
})

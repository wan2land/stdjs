
import {} from "jest"

import * as bottler from "../dist"

describe("bottler", () => {
  it("exists shared", () => {
    expect.assertions(2)

    expect(bottler.Container.shared).toBeInstanceOf(bottler.Container)
    expect(bottler.default).toBeInstanceOf(bottler.Container)
  })
})

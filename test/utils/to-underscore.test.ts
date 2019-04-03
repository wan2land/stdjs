import { toUnderscore } from "../../lib/utils/to-underscore"

describe("testsuite utils.to-underscore.", () => {
  it("test plain text", async () => {
    expect(toUnderscore("hello")).toBe("hello")
  })

  it("test underscore", async () => {
    expect(toUnderscore("hello_world")).toBe("hello_world")
  })

  it("test camelcase", async () => {
    expect(toUnderscore("helloWorld")).toBe("hello_world")
  })

  it("test pascalcase", async () => {
    expect(toUnderscore("HelloWorld")).toBe("hello_world")
    expect(toUnderscore("GraphQL")).toBe("graph_q_l")
  })
})

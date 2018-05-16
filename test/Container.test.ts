
import {} from "jest"

import {Container} from "../dist/Container"

// tslint:disable triple-equals

interface TestObject {
  message: string
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe("Container", () => {

  it("bind simple value", async () => {
    expect.assertions(4)

    const container = new Container()

    container.set("obj1", {message: "hello world 11"})
    container.set("obj2", {message: "hello world 22"})

    await expect(container.get("obj1")).resolves.toEqual({message: "hello world 11"})
    await expect(container.get("obj2")).resolves.toEqual({message: "hello world 22"})

    expect(await container.get("obj1") === await container.get("obj1")).toBeTruthy()
    expect(await container.get("obj2") === await container.get("obj2")).toBeTruthy()
  })

  it("bind simple factory as singleton", async () => {
    expect.assertions(4)

    const container = new Container()

    container.set("obj1", () => ({message: "hello world 11"}))
    container.set("obj2", () => ({message: "hello world 22"}))

    await expect(container.get("obj1")).resolves.toEqual({message: "hello world 11"})
    await expect(container.get("obj2")).resolves.toEqual({message: "hello world 22"})

    expect(await container.get("obj1") === await container.get("obj1")).toBeTruthy()
    expect(await container.get("obj2") === await container.get("obj2")).toBeTruthy()
  })

  it("bind simple factory", async () => {
    expect.assertions(6)

    const container = new Container()

    container.set<TestObject>("obj1", () => ({message: "hello world 11"})).factory()
    container.set<TestObject>("obj2", () => ({message: "hello world 22"})).factory()

    await expect(container.get("obj1")).resolves.toEqual({message: "hello world 11"})
    await expect(container.get("obj2")).resolves.toEqual({message: "hello world 22"})

    // equal, but not same.
    expect(await container.get("obj1")).toEqual(await container.get("obj1"))
    expect(await container.get("obj2")).toEqual(await container.get("obj2"))
    expect(await container.get("obj1") === await container.get("obj1")).toBeFalsy()
    expect(await container.get("obj2") === await container.get("obj2")).toBeFalsy()
  })

  it("test after", async () => {
    expect.assertions(1)

    const container = new Container()

    container
      .set<TestObject>("obj1", () => ({message: "hello world 11"}))
      .factory()
      .after(async (context) => {
        await sleep(300)
        context.message = context.message + " changed!"
        return context
      })

    await expect(container.get("obj1"))
      .resolves
      .toEqual({message: "hello world 11 changed!"})
  })
})

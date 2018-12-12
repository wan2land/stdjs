
// tslint:disable typedef max-classes-per-file

import "jest"

import * as di from "../dist"

interface TestObject {
  message: string
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// monkey patch
const consoleLog = console.log
function turnConsoleOff(): void {
  console.log = () => { /* nothing */ }
}
function turnConsoleOn(): void {
  console.log = consoleLog
}


describe("tests for README", () => {
  it("test to bind simple value", async () => {
    expect.assertions(4)

    const container = di.create()

    turnConsoleOff()
    // section:bind-simple-value
    container.instance("obj1", {message: "this is obj1"})
    container.instance("obj2", {message: "this is obj2"})

    console.log(await container.get("obj1")) // {message: "this is obj1"}
    console.log(await container.get("obj2")) // {message: "this is obj2"}

    console.log(await container.get("obj1") === await container.get("obj1")) // true
    console.log(await container.get("obj2") === await container.get("obj2")) // true
    // endsection
    turnConsoleOn()

    expect(await container.get("obj1")).toEqual({message: "this is obj1"})
    expect(await container.get("obj2")).toEqual({message: "this is obj2"})

    expect(await container.get("obj1") === await container.get("obj1")).toBeTruthy()
    expect(await container.get("obj2") === await container.get("obj2")).toBeTruthy()
  })

  it("test to bind promise value", async () => {
    expect.assertions(4)

    const container = di.create()

    turnConsoleOff()
    // section:bind-promise-value
    function promise1() {
      return new Promise(resolve => resolve({message: "this is promise1"}))
    }
    async function promise2() {
      sleep(500)
      return {message: "this is promise2"}
    }
    container.instance("promise1", promise1())
    container.instance("promise2", promise2())

    console.log(await container.get("promise1")) // {message: "this is promise1"}
    console.log(await container.get("promise2")) // {message: "this is promise2"}

    console.log(await container.get("promise1") === await container.get("promise1")) // true
    console.log(await container.get("promise2") === await container.get("promise2")) // true
    // endsection
    turnConsoleOn()

    expect(await container.get("promise1")).toEqual({message: "this is promise1"})
    expect(await container.get("promise2")).toEqual({message: "this is promise2"})

    expect(await container.get("promise1") === await container.get("promise1")).toBeTruthy()
    expect(await container.get("promise2") === await container.get("promise2")).toBeTruthy()
  })

  it("test to bind factory", async () => {
    expect.assertions(3)

    const container = di.create()

    turnConsoleOff()
    // section:bind-factory
    container.factory("factory1", () => ({message: "this is factory"}))
    container.factory("factory2", () => {
      return new Promise(resolve => {
        resolve({message: "this is promise factory"})
      })
    })
    container.factory("factory3", async () => {
      sleep(500)
      return {message: "this is async factory"}
    })

    console.log(await container.get("factory1")) // {message: "this is factory"}
    console.log(await container.get("factory2")) // {message: "this is promise factory"}
    console.log(await container.get("factory3")) // {message: "this is async factory"}
    // endsection
    turnConsoleOn()

    expect(await container.get("factory1")).toEqual({message: "this is factory"})
    expect(await container.get("factory2")).toEqual({message: "this is promise factory"})
    expect(await container.get("factory3")).toEqual({message: "this is async factory"})
  })

  it("test to bind class", async () => {
    expect.assertions(2)

    const container = di.create()

    turnConsoleOff()
    // section:bind-class
    class Driver {
    }

    class Connection {
      constructor(@di.Inject("driver") public driver: Driver) {
      }
    }
    container.bind("driver", Driver)
    container.bind("connection", Connection)

    const connection = await container.get<Connection>("connection")
    console.log(connection) // Connection { driver: Driver {} }
    console.log(connection.driver) // Driver {}
    // endsection
    turnConsoleOn()

    expect(connection).toBeInstanceOf(Connection)
    expect(connection.driver).toBeInstanceOf(Driver)
  })

  it("test singleton descriptor", async () => {
    expect.assertions(4)

    const container = di.create()

    class Foo {
    }

    turnConsoleOff()
    // section:singleton-descriptor
    container.factory("factory.normal", () => ({message: "this is factory"}))
    container.factory("factory.singleton", () => ({message: "this is factory with singleton"})).singleton()

    container.bind("class.normal", Foo)
    container.bind("class.singleton", Foo).singleton()

    // not same
    console.log(await container.get("factory.normal") === await container.get("factory.normal")) // false
    console.log(await container.get("class.normal") === await container.get("class.normal")) // false

    // always same
    console.log(await container.get("factory.singleton") === await container.get("factory.singleton")) // true
    console.log(await container.get("class.singleton") === await container.get("class.singleton")) // true
    // endsection
    turnConsoleOn()

    // equal, but not same.
    expect(await container.get("factory.normal") === await container.get("factory.normal")).toBeFalsy()
    expect(await container.get("class.normal") === await container.get("class.normal")).toBeFalsy()

    expect(await container.get("factory.singleton") === await container.get("factory.singleton")).toBeTruthy()
    expect(await container.get("class.singleton") === await container.get("class.singleton")).toBeTruthy()
  })

  it("test after descriptor", async () => {
    expect.assertions(1)

    const container = di.create()

    turnConsoleOff()
    // section:after-descriptor

    container
      .factory("foo", () => ({message: "this is origin maessage."}))
      .after(async (context) => {
        await sleep(300)
        context.message = context.message + " and something appended."
        return context
      })

    console.log(await container.get("foo")) // {message: "this is origin maessage. and something appended."}

    // endsection
    turnConsoleOn()


    expect(await container.get("foo")).toEqual({message: "this is origin maessage. and something appended."})
  })
})

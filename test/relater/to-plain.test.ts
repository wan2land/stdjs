import { toPlain } from "../../src/relater/to-plain"
import { Article } from "../stubs/article"

const isPlainObject = require("lodash.isplainobject") // eslint-disable-line


describe("testsuite of relater/to-plain", () => {

  it("test toPlain one", async () => {

    const article = toPlain(Article, {id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"})

    expect(article).toEqual({id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"})
    expect(isPlainObject(article)).toBeTruthy()
  })

  it("test toPlain many", async () => {
    const articles = toPlain(Article, [
      {id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"},
    ])

    expect(articles).toEqual([{id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"}])
    articles.map(row => expect(isPlainObject(row)).toBeTruthy())
  })
})

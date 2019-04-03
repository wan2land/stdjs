import { createOptions } from "../../src/relater/create-options"
import { Transformer } from "../../src/relater/transformer"
import { Article } from "../stubs/article"

const isPlainObject = require("lodash.isplainobject") // eslint-disable-line


describe("testsuite of relater/transformer", () => {

  const transformer = new Transformer(createOptions(Article))

  it("test toEntity one", async () => {

    const article = transformer.toEntity({id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"})

    expect(article).toEqual({id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"})
    expect(article).toBeInstanceOf(Article)
  })

  it("test toEntity many", async () => {
    const articles = transformer.toEntity([
      {id: 10, title: "", created_at: "2019-03-01 00:00:00"},
      {id: 11, title: "this is title", created_at: "2019-03-01 00:00:00"},
    ])

    expect(articles).toEqual([
      {id: 10, title: "", createdAt: "2019-03-01 00:00:00"},
      {id: 11, title: "this is title", createdAt: "2019-03-01 00:00:00"},
    ])
    articles.map(row => expect(row).toBeInstanceOf(Article))
  })

  it("test toPlain one", async () => {
    // by class
    const article1 = transformer.toPlain(Object.assign(new Article(), {id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"}))

    expect(article1).toEqual({id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"})
    expect(isPlainObject(article1)).toBeTruthy()


    // by deep partial
    const article2 = transformer.toPlain({id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"})

    expect(article2).toEqual({id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"})
    expect(isPlainObject(article2)).toBeTruthy()
  })

  it("test toPlain many", async () => {
    // by class
    const articles1 = transformer.toPlain([
      Object.assign(new Article(), {id: 10, title: "", createdAt: "2019-03-01 00:00:00"}),
      Object.assign(new Article(), {id: 11, title: "this is title", createdAt: "2019-03-02 00:00:00"}),
    ])

    expect(articles1).toEqual([
      {id: 10, title: "", created_at: "2019-03-01 00:00:00"},
      {id: 11, title: "this is title", created_at: "2019-03-02 00:00:00"},
    ])
    articles1.map(article1 => expect(isPlainObject(article1)).toBeTruthy())


    // by deep partial
    const articles2 = transformer.toPlain([
      {id: 10, title: "", createdAt: "2019-03-01 00:00:00"},
      {id: 11, title: "this is title", createdAt: "2019-03-02 00:00:00"},
    ])

    expect(articles2).toEqual([
      {id: 10, title: "", created_at: "2019-03-01 00:00:00"},
      {id: 11, title: "this is title", created_at: "2019-03-02 00:00:00"},
    ])
    articles2.map(article2 => expect(isPlainObject(article2)).toBeTruthy())
  })
})

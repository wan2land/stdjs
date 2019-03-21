import { createOptions } from "../../src/relater/create-options"
import { Mapper } from "../../src/relater/mapper"
import { Article } from "../stubs/article"


describe("testsuite of relater/mapper", () => {

  it("test map single", async () => {
    const mapper = new Mapper(createOptions(Article))

    const article = mapper.map({id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"})

    expect(article).toEqual({id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"})
    expect(article).toBeInstanceOf(Article)
  })

  it("test map multiple", async () => {
    const mapper = new Mapper(createOptions(Article))

    const articles = mapper.map([
      {id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"},
    ])

    expect(articles).toEqual([{id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"}])
    articles.map(row => expect(row).toBeInstanceOf(Article))
  })
})

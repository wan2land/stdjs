import { toEntity } from "../../src/relater/to-entity"
import { Article } from "../stubs/article"


describe("testsuite of relater/to-entity", () => {

  it("test toEntity one", async () => {

    const article = toEntity(Article, {id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"})

    expect(article).toEqual({id: 10, title: "this is title", contents: null, createdAt: "2019-03-01 00:00:00"})
    expect(article).toBeInstanceOf(Article)
  })

  it("test toEntity many", async () => {
    const articles = toEntity(Article, [
      {id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"},
    ])

    expect(articles).toEqual([{id: 10, title: "this is title", contents: null, createdAt: "2019-03-01 00:00:00"}])
    articles.map(row => expect(row).toBeInstanceOf(Article))
  })
})

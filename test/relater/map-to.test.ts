import { mapTo } from "../../src/relater/map-to"
import { Article } from "../stubs/article"


describe("testsuite of relater/map-to", () => {

  it("test mapTo single", async () => {

    const article = mapTo({id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"}, Article)

    expect(article).toEqual({id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"})
    expect(article).toBeInstanceOf(Article)
  })

  it("test mapTo multiple", async () => {
    const articles = mapTo([
      {id: 10, title: "this is title", created_at: "2019-03-01 00:00:00"},
    ], Article)

    expect(articles).toEqual([{id: 10, title: "this is title", createdAt: "2019-03-01 00:00:00"}])
    articles.map(row => expect(row).toBeInstanceOf(Article))
  })
})

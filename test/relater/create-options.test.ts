import { createOptions } from "../../src/relater/create-options"
import { Article } from "../stubs/article"
import { Country } from "../stubs/country"


describe("testsuite of relater/create-options", () => {
  it("test stubs/article", () => {
    expect(createOptions(Article)).toEqual({
      ctor: Article,
      columns: [
        {
          type: "int",
          property: "id",
          sourceKey: "id",
        },
        {
          type: "string",
          property: "title",
          sourceKey: "title",
        },
        {
          type: "string",
          property: "contents",
          sourceKey: "contents",
        },
        {
          type: "string",
          property: "createdAt",
          sourceKey: "created_at",
        },
      ],
      relations: [
        {
          type: "one-to-one",
          target: Country,
          property: "country",
          key: "country_id",
          relatedKey: "country_id",
        },
      ],
    })
  })
})

import { createOptions } from "../../src/relater/create-options"
import { Article } from "../stubs/article"
import { User } from "../stubs/user"


describe("testsuite of relater/create-options", () => {
  it("test stubs/article", () => {
    expect(createOptions(Article)).toEqual({
      ctor: Article,
      columns: [
        {
          type: "int",
          property: "id",
          sourceKey: "id",
          nullable: false,
        },
        {
          type: "string",
          property: "title",
          sourceKey: "title",
          nullable: false,
        },
        {
          type: "string",
          property: "contents",
          sourceKey: "contents",
          nullable: true,
        },
        {
          type: "string",
          property: "createdAt",
          sourceKey: "created_at",
          nullable: false,
        },
      ],
      relations: [
        {
          type: "one-to-one",
          target: User,
          property: "user",
          key: "user_id",
          relatedKey: "id",
        },
      ],
    })
  })
})

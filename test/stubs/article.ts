import { BelongsTo, Column } from "../../src"
import { Country } from "./country"


export class Article {

  @Column({name: "id", type: "int"})
  public id?: number

  @Column()
  public title!: string

  @Column()
  public contents!: number

  @Column({name: "created_at"})
  public createdAt!: string

  @BelongsTo(type => Country, {key: "country_id", relatedKey: "country_id"})
  public country?: Country
}

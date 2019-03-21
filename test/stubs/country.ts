import { Column, HasMany } from "../../src"
import { Article } from "./article"


export class Country {

  @Column({name: "country_id"})
  public countryId?: number

  @Column()
  public country!: string

  @HasMany(type => Article, {key: "country_id", relatedKey: "country_id"})
  public cities?: Article[]
}

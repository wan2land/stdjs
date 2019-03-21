import { Column, HasMany } from "../../src"
import { City } from "./city"


export class Country {

  @Column({name: "country_id"})
  public countryId?: number

  @Column()
  public country!: string

  @HasMany(type => City, {key: "country_id", relatedKey: "country_id"})
  public cities?: City[]
}

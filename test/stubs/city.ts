import { BelongsTo, Column } from "../../src"
import { Country } from "./country"


export class City {

  @Column({name: "city_id", type: "int"})
  public cityId?: number

  @Column()
  public city!: string

  @Column({name: "country_id"})
  public countryId!: number

  @Column({name: "last_update"})
  public lastUpdate!: string

  @BelongsTo(type => Country, {key: "country_id", relatedKey: "country_id"})
  public country?: Country
}

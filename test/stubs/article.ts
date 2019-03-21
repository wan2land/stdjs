import { BelongsTo, Column } from "../../src"
import { User } from "./user"


export class Article {

  @Column({type: "int"})
  public id?: number

  @Column()
  public title!: string

  @Column()
  public contents!: number

  @Column({name: "created_at"})
  public createdAt!: string

  @BelongsTo(type => User, {key: "user_id", relatedKey: "id"})
  public user?: User
}

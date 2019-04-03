import { Column, HasMany } from "../../lib"
import { Article } from "./article"


export class User {

  @Column()
  public id?: number

  @Column()
  public username!: string

  @Column({name: "created_at"})
  public createdAt!: string

  @HasMany(type => Article, {key: "id", relatedKey: "user_id"})
  public articles?: Article[]
}

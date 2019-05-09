import { Container } from "./container"
import { Containable } from "./interfaces/container"


export function create(): Containable {
  return new Container()
}

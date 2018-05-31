
import {Container} from "./container"
import {Containable} from "./interfaces"

export function create(): Containable {
  return new Container()
}

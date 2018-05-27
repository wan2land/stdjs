
import {Container} from "./container"
import * as types from "./types"

export function create(): types.ContainerInterface {
  return new Container()
}

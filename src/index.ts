
import {create} from "./create"
import {ContainerFluent, ContainerInterface, Provider} from "./types"
import {Container} from "./container"

const shared = new Container()

export {
  create,
  shared,
  Container,
  ContainerFluent,
  ContainerInterface,
  Provider,
}

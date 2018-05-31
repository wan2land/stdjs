
import {create} from "./create"
import {ContainerFluent, Containable, Provider} from "./interfaces"
import {Container} from "./container"

const shared = create()

export {
  create,
  shared,
  Container,
  ContainerFluent,
  Containable,
  Provider,
}

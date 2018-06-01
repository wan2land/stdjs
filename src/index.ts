
import {create} from "./create"
import {ContainerFluent, Containable, Provider} from "./interfaces"
import {Container} from "./container"
import {inject} from "./annotations/inject"

const shared = create()

export {
  inject,
  create,
  shared,
  Container,
  ContainerFluent,
  Containable,
  Provider,
}

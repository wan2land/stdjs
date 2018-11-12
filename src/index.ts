import { inject } from "./annotations/inject"
import { Container } from "./container"
import { create } from "./create"
import { Containable, ContainerFluent, Provider } from "./interfaces"


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

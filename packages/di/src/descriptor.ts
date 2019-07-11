import { ContainerFluent } from './interfaces/container'

export class Descriptor<TVal> implements ContainerFluent<TVal> {

  public isFrozen = false

  public isSingleton = false

  public afterHandlers: ((context: TVal) => TVal|Promise<TVal>)[] = []

  public freeze(): ContainerFluent<TVal> {
    this.isFrozen = true
    return this
  }

  public singleton(): ContainerFluent<TVal> {
    this.isSingleton = true
    return this
  }

  public after(handler: (context: TVal) => TVal|Promise<TVal>): ContainerFluent<TVal> {
    this.afterHandlers.push(handler)
    return this
  }
}

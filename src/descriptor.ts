
import * as types from "./types"

export class Descriptor<P> implements types.ContainerFluent<P> {

  public isFrozen = false

  public isFactory = false

  public afterHandlers: Array<(context: P) => P|Promise<P>> = []

  public freeze(): types.ContainerFluent<P> {
    this.isFrozen = true
    return this
  }

  public factory(): types.ContainerFluent<P> {
    this.isFactory = true
    return this
  }

  public after(handler: (context: P) => P|Promise<P>): types.ContainerFluent<P> {
    this.afterHandlers.push(handler)
    return this
  }
}

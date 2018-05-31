
export type Identifier = string | symbol

export interface Containable {
  instance<P>(name: Identifier, instance: P|Promise<P>): void
  factory<P>(name: Identifier, factory: () => P|Promise<P>): ContainerFluent<P>
  bind<P>(name: Identifier, constructor: {new (...args: any[]): P}): ContainerFluent<P>
  get<P>(name: Identifier): Promise<P>
  register(provider: Provider): void
}

export interface ContainerFluent<P> {
  freeze(): ContainerFluent<P>
  singleton(): ContainerFluent<P>
  after(handler: (context: P) => P|Promise<P>): ContainerFluent<P>
}

export interface Provider {
  register(app: Containable): void | Promise<void> // async safety
  boot?(app: Containable): void | Promise<void> // async safety
  close?(app: Containable): void | Promise<void> // async safety
}

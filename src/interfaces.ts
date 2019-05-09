
export interface Containable {
  instance<P>(name: PropertyKey, instance: P|Promise<P>): void
  factory<P>(name: PropertyKey, factory: () => P|Promise<P>): ContainerFluent<P>
  bind<P>(name: PropertyKey, constructor: {new (...args: any[]): P}): ContainerFluent<P>
  get<P>(name: PropertyKey): Promise<P>
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


// tslint:disable unified-signatures

export interface ContainerInterface {
  set<P>(name: string, value: P): void
  set<P>(name: string, value: Promise<P>): void
  set<P>(name: string, factory: () => P): ContainerFluent<P>
  set<P>(name: string, factory: () => Promise<P>): ContainerFluent<P>
  get<P>(name: string): Promise<P>
}

export interface ContainerFluent<P> {
  freeze(): ContainerFluent<P>
  factory(): ContainerFluent<P>
  after(handler: (context: P) => P|Promise<P>): ContainerFluent<P>
}

export interface Provider {
  register(app: ContainerInterface): Promise<void>
  boot(app: ContainerInterface): Promise<void>
}

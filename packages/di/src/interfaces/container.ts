import { ConstructType, MaybePromise } from './common'

export interface Containable {
  instance<T>(name: PropertyKey, instance: T|Promise<T>): void
  factory<T>(name: PropertyKey, factory: () => T|Promise<T>): ContainerFluent<T>
  bind<T>(name: PropertyKey, constructor: ConstructType<T>): ContainerFluent<T>
  get<T>(name: PropertyKey): Promise<T>
  register(provider: Provider): void
  create<T>(ctor: ConstructType<T>): Promise<T>
  invoke<TIns, TRet = any>(instance: TIns, method: keyof TIns): Promise<TRet>
}

export interface ContainerFluent<T> {
  freeze(): ContainerFluent<T>
  singleton(): ContainerFluent<T>
  after(handler: (context: T) => MaybePromise<T>): ContainerFluent<T>
}

export interface Provider {
  register(app: Containable): any
  boot?(app: Containable): any
  close?(app: Containable): any
}
